var q = require('q'),
    fs = require('fs');

var ly = require('./data/ly-info').data;
  
var NameToParty = {};
ly.map(function (value) {
  NameToParty[value.name] = value.party_eng;

})

function getData(path){
    var deferred = q.defer();
    var url = path+'.txt';
    fs.readFile(url, 'utf8', function (err, data) {
       if (err) throw err;
       //obj = JSON.parse(data);
       deferred.resolve(data);
    });

    return deferred.promise;
};


function parse(){
  var count = 0;
  var dis_index = -1;
  var dis_end_index = -1;
  var discussion_part = "";

  var result = {};
  var sayings = [];

  getData('./data/meeting').then(function(data){
      var pre_linebreak = 0;
      var meta_count = 0;
      //Get Discussion Part
      for(var i=0 ; i<data.length ; i++){
          //討　論　事　項
          var sub = data.substr(i,7);
          if(sub === '討　論　事　項'){
            console.log(i);
            console.log(sub+'*');
            count++;
            dis_index = i;
            
          }
          if(sub === '宣讀協商結論。'){
              dis_end_index = i+8;

              console.log('宣讀協商結論');
              console.log(i);
              
          }

          // Get 會議名稱、日期時間、主席, Format:
          // 立法院第8屆第6會期內政委員會第27次全體委員會議紀錄 
          // 時　　間　中華民國103年12月17日（星期三）9時4分至11時26分
          // 地　　點　本院紅樓202會議室
          // 主　　席　吳委員育昇
          if(data[i]==='\n' && meta_count < 4){
              
              switch(meta_count){
                  case 0:
                      result.title = data.substring(pre_linebreak,i);
                      break;
                  case 1:
                      var sub = data.substring(pre_linebreak+1,i);
                      result.date = sub.substr(sub.lastIndexOf("　")+1); 
                      break;
                  case 2:
                      var sub = data.substring(pre_linebreak+1,i);
                      result.venue = sub.substr(sub.lastIndexOf("　")+1);
                      break;
                  case 3:
                      var sub = data.substring(pre_linebreak+1,i);
                      result.chairman = sub.substr(sub.lastIndexOf("　")+1);
                      break;

              }

              meta_count ++;
              pre_linebreak = i;

          }
      }
      if(dis_index !== -1 && dis_end_index !== -1){
          discussion_part = data.substring(dis_index, dis_end_index);
          console.log("section starting from:"+dis_index);
          console.log("section end at:"+dis_end_index);
          //console.log(discussion_part);

      }else{
          if(dis_index === -1){
            console.log("error: can't find discusstion start section.");
            return;
          }
          
          discussion_part = data.substr(dis_index);
          //console.log(discussion_part);

      }

      //Get Each Saying
      pre_linebreak = 0;
      var pre_colon = 0;

      var test = "";
      var current_speaker = "";
      var current_speaker_party = "";
      var current_is_chairman = false;

      var saying_count = 0;
      for(var i=0 ; i<discussion_part.length ; i++){
          //\n李委員俊俋：
        
          switch(discussion_part[i]){
              case '\n':
                if(pre_linebreak > 0){

                  if(current_speaker){
                      var item = {};
                      item.index = saying_count;
                      item.speaker = current_speaker;
                      item.speaker_party = current_speaker_party;
                      item.isChairman = current_is_chairman;
                      item.paragraph = discussion_part.substring(pre_colon+1,i);
console.log(current_speaker);
                      
                      if(sayings.length > 0){
                          //Replace: if it's the second (or more) paraphagh of the same speaker's addressment.
                          var last_para = sayings[sayings.length-1].paragraph;
                          
                          if(item.paragraph.indexOf(last_para)!==-1){
                              sayings[sayings.length-1] = item;
                          }else{
                              sayings.push(item);

                          }

                      }else{
                          sayings.push(item);

                      }
                      saying_count++;

                      
                      pre_linebreak = i;

                  }else{//討論主題
                      result.topic = discussion_part.substring(pre_linebreak+1,i);
                      pre_linebreak = i;
                  }
                  

                }else{
                  pre_linebreak = i;
                }
                
                
                break;

              case '：':
                  //NEW SPEAKER
                  if((i-pre_linebreak)<10){//get the cloest, previous linebreak
                      current_speaker = discussion_part.substring(pre_linebreak+1,i);

                      var name = current_speaker;
                      if(name==='主席')
                         name = result.chairman;

                      

                      name = name.replace("委員","");
                      current_speaker_party = NameToParty[name] || "GOV";
                     
                      console.log(name+" "+current_speaker_party);
                     

                  }
                  // if(current_speaker==='主席')
                  //     current_speaker = name + "（主席）";//+= '（'+result.chairman.replace("委員","")+'）';
                  // else
                  //     current_speaker = name;
                 

                  if(current_speaker==='主席'){
                      current_is_chairman = true;
                      
                      
                  }else{
                      current_is_chairman = false;
                  }
                  current_speaker = name;
                  
                
                pre_colon = i;
                
                break;


          }
         
          
      }
      result.sayings = sayings;

      
      //Save
      fs.writeFile("data/result.json", JSON.stringify(result, null, 4), function(err) {//JSON.stringify(sayings, null, 4)
          if(err) {
              console.log(err);
          } else {
              console.log(" - File saved.");  
          }
      }); 
 

  });


}

parse();



