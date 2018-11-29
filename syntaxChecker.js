/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// ------------------------------------------------//
// -----checking the text for syntax error...------//
// ------------------------------------------------//
function applyCheck(text1){
    
}

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor*/

var sc_globalobject = ['man','enemy','g1','ground','wall'];
var sc_platformer = ['man'];
var sc_topdown = ['enemy'];
var sc_static = ['wall','ground'];
var sc_gun = ['g1'];
var sc_audio = ['au'];
var sc_datatypes = ['sc_platformer','sc_topdown','sc_static','sc_gun','sc_audio'];
var sc_platformerfunction=['moveX','moveY','follow','stick','destory'];
var sc_topdownfunction=['jump'];
var sc_gunfunction = ['shoot'];
var sc_audiofunction = ['playOnce','playForever'];
var sc_staticfunction = ['stick','destory'];
var sc_loadedobject = [];
var sc_errorarray = [];
var sc_Errorline = [];
function checkSyntax(wordtextcheck){
    var text = wordtextcheck;    
    sc_loadedobject = [];
    sc_errorarray = [];
    sc_Errorline = [];
    blockCheck(text);    
    document.getElementById('err-console').innerHTML = 'Error Console:';
    for(i=0;i<sc_errorarray.length;i++){  
        var reg = new RegExp('\\b'+sc_Errorline[i]+'\\b','g');
        linenum = linenum.replace(reg,'<mark class="error-line" id = "'+sc_Errorline[i]+'" onmouseover="errpop('+sc_Errorline[i]+',event);" onmouseout="errpopout();">00</mark>');
        console.log(linenum);
        //document.getElementById('err-console').innerHTML += '<br>'+sc_errorarray[i];        
    }
}
function blockCheck(btext){/**  Catching Block For checking...  **/
    var checktext = btext.split('\n');
    var localvariable = [];
    
    for(i = 0 ;i < checktext.length ; i++){
        var checktxt = checktext[i].trim();
        if(/.*;/g.test(checktext[i]) === true || /.*:/g.test(checktext[i]) === true || checktxt.length === 0){
        /*Checking for local Variable Discription...*/

        if(/int (.*)[\s,=][\s](.*);/g.test(checktext[i].trim()) === true){
            localvariable[localvariable.length] = checktext[i].replace(/int[\s]+(.*)[\s]+=[\s]*(.*)[\s]*;/g,'$1 $2');            
        }
        
        /*   Checking For loadObject function...   */

        if(/\bloadObject\b/g.test(checktext[i]) === true){
            
            checktext[i] = checktext[i].replace(/loadObject[(](.*)[)];/g,'$1');

            var check2 = checktext[i].split(',');
            console.log(check2);            
            var matches = matchobject(check2[0],sc_globalobject);            
            if(matches === -1 ){
                sc_errorarray[sc_errorarray.length] = '\nFirst Parameter should be object';
                sc_Errorline[sc_Errorline.length] = i+1;
                //alert('Line Number:'+(i+1)+'\nFirst Parameter should be object');
            }else{
                if(sc_loadedobject.indexOf(check2[0]) === -1){
                    sc_loadedobject[sc_loadedobject.length] = check2[0];
                }                
            }
            var matches1 = Number.isInteger(parseFloat(check2[1]));
            if(matches1 === false){
                sc_errorarray[sc_errorarray.length] = '\nSecond Parameter should be Integer Number like 10,5,20....';
                sc_Errorline[sc_Errorline.length] = i+1;
            }
            var matches1 = Number.isInteger(parseFloat(check2[2]));
            if(matches1 === false){
                sc_errorarray[sc_errorarray.length] = '\nThird Parameter should be Integer Number like 10,5,20....';
                sc_Errorline[sc_Errorline.length] = i+1;
            }
        }
        

        /*Checking for loadAudio function...*/

        if(/\bloadAudio\b/g.test(checktext[i]) === true){

            checktext[i] = checktext[i].replace(/loadAudio[(](.*)[)];/g,'$1');

            check2 = checktext[i].split(',');

            var matches = 0;

            for(j=0;j<sc_audio.length;j++){
                var ch = new RegExp('\\b'+sc_audio[j]+'\\b','g');
                var partext = check2[0].trim();
                console.log(check2[0]);
                console.log(ch);
                matches = partext.search(ch);
                console.log(matches);
                if(matches > -1){
                    if(sc_loadedobject.indexOf(check2[0]) === -1){
                        sc_loadedobject[sc_loadedobject.length] = check2[0];
                    }
                    break;
                }
            }
            console.log(matches);
            if(matches === -1 ){
                sc_errorarray[sc_errorarray.length] = '\nFirst Parameter should be of sc_audio type';
                sc_Errorline[sc_Errorline.length] = i+1;
            }                        
        }

        /*checking object with function properties...*/

        if(/(.*)[.]{1}(.*)[(](.*)[)];/g.test(checktext[i]) === true){            
            checktext[i] = checktext[i].replace(/(.*)[.]{1}(.*)[(](.*)[)];/g,'$1 $2 $3');
            var check2 = checktext[i].split(" ");
            if (sc_loadedobject.indexOf(check2[0]) > -1){ //  Checking for object for sc_platformer,sc_topdown,sc_static,sc_gun...
                var matches = matchobject(check2[0],sc_globalobject);            

                if(matches === -1){  // Checking for sc_audio object...
                    matches = matchobject(check2[0],sc_audio);
                    if(matches === -1){
                        sc_errorarray[sc_errorarray.length] = 'First Parameter should be object';
                        sc_Errorline[sc_Errorline.length] = i+1;
                    }else{   //  Checking sc_audio function... 
                        var matches2 = matchobject(check2[1],sc_audiofunction);
                        if(matches2 === -1){
                            sc_errorarray[sc_errorarray.length] = 'Object Method is invalid...';
                            sc_Errorline[sc_Errorline.length] = i+1;
                        }else{     // Checking parameter for sc_audio function...
                            if(check2[2] !== ''){                    
                                sc_errorarray[sc_errorarray.length] = 'No Parameter required...';
                                sc_Errorline[sc_Errorline.length] = i+1;
                            }
                        }
                    }                
                }else{
                    var matches2 = objecttype(check2[0]);                
                    if(matches2 === 'sc_platformer'){ // checking object method validation for sc_platformer...
                        var matches3 = matchobject1(check2[1],sc_platformerfunction,check2[2]);
                        if(matches3 === -1){
                            sc_errorarray[sc_errorarray.length] = 'Object Method is invalid...';
                            sc_Errorline[sc_Errorline.length] = i+1;
                        }else{                        
                            if(matches1 === false){                    
                                sc_errorarray[sc_errorarray.length] = 'Third Parameter should be Integer Number like 10,5,20....';
                                sc_Errorline[sc_Errorline.length] = i+1;
                            }
                        }
                    } else if(matches2 === 'sc_topdown'){ // checking object method validation for sc_topdown...
                        var matches3 = matchobject1(check2[1],sc_topdownfunction,check2[2]);
                        if(matches3 === -1){
                            sc_errorarray[sc_errorarray.length] = 'Object Method is invalid...';
                            sc_Errorline[sc_Errorline.length] = i+1;
                        }else{
                            if(matches1 === false){ 
                                sc_errorarray[sc_errorarray.length] = 'Third Parameter should be Integer Number like 10,5,20....';
                                sc_Errorline[sc_Errorline.length] = i+1;
                            }
                        }
                    }else if(matches2 === 'sc_static'){ // checking object method validation for sc_static...
                        var matches3 = matchobject1(check2[1],sc_staticfunction,check2[2]);
                        if(matches3 === -1){
                            sc_errorarray[sc_errorarray.length] = 'Object Method is invalid...';
                            sc_Errorline[sc_Errorline.length] = i+1;
                        }else{
                            if(matches1 === false){
                                sc_errorarray[sc_errorarray.length] = 'Third Parameter should be Integer Number like 10,5,20....';
                                sc_Errorline[sc_Errorline.length] = i+1;
                            }
                        }
                    }else if(matches2 === 'sc_gun'){ // checking object method validation for sc_gun...
                        var matches3 = matchobject1(check2[1],sc_gunfunction,check2[2]);
                        if(matches3 === -1){
                            sc_errorarray[sc_errorarray.length] = 'Object Method is invalid...';
                            sc_Errorline[sc_Errorline.length] = i+1;
                        }else{
                            if(matches1 === false){
                                sc_errorarray[sc_errorarray.length] = 'Third Parameter should be Integer Number like 10,5,20....';
                                sc_Errorline[sc_Errorline.length] = i+1;
                            }
                        }
                    }else{
                        sc_errorarray[sc_errorarray.length] = matches2;
                        sc_Errorline[sc_Errorline.length] = i+1;
                    }                
                }
            }else{
                sc_errorarray[sc_errorarray.length] = check2[0]+' object Not Loaded yet';
                sc_Errorline[sc_Errorline.length] = i+1;
            }            
        } 
        
        // Checking Mathematical error...
        
        if(/.*=/g.test(checktext[i]) === true){
            
            var mathexp = checktext[i].replace(/(.*=.*);/g,'$1');
            var strexp = '';
            
            for(j = 0;j < mathexp.length; j++){ // generate math regexp...                   
                if(mathexp.charAt(j) === ')'){
                    strexp += '[\\s]*[\\w\\d]+[\\s]*['+mathexp.charAt(j)+']?[\\s]*['+mathexp.charAt(j+1)+']?';
                    j = j+2;                    
                }
                if(mathexp.charAt(j) === '+' || mathexp.charAt(j) === '-' || mathexp.charAt(j) === '*' || mathexp.charAt(j) === '/'){
                    strexp += '[\\s]*[\\w\\d]+[\\s]*['+mathexp.charAt(j)+']?';
                }
                if(mathexp.charAt(j) === '('){
                    strexp += '[\\s]*['+mathexp.charAt(j)+']*';
                }
                if(mathexp.charAt(j) === '='){
                    strexp += '[\\w]+[\\s]*'+mathexp.charAt(j);
                }                
            }
            strexp += '[\\s]*[\\w\\d]+[\\s]*;'
            var strReg = new RegExp(strexp,'g');
            if(strReg.test(checktext[i]) === false){
                sc_errorarray[sc_errorarray.length] = 'Arithematic expression error';
                sc_Errorline[sc_Errorline.length] = i+1;
            }
            console.log(strexp);
        }
        
        // Checking Object with Object syntax...
        
        if(/.*[\s]{1}with[\s]{1}.*[:,;]{1}/g.test(checktext[i]) === true){
            
            checktext[i] = checktext[i].replace(/(.*)[\s]{1}(with)[\s]{1}(.*)[:,;]{1}/g,'$1 $2 $3');
            console.log(checktext[i]);
            var check2 = checktext[i].split(' ');
            console.log(check2);
            var withmatch = matchobject(check2[0],sc_globalobject);
            if(withmatch > -1){
                withmatch = matchobject(check2[2],sc_globalobject);
                if(withmatch === -1){
                    sc_errorarray[sc_errorarray.length] = 'Second Parameter Object Not Declared...';
                    sc_Errorline[sc_Errorline.length] = i+1;
                }
            }else{
                sc_errorarray[sc_errorarray.length] = 'First Parameter Object Not Declared...';
                sc_Errorline[sc_Errorline.length] = i+1;
            }
        }
    } else {
        sc_errorarray[sc_errorarray.length] = 'Semi Colon Missing...';
        sc_Errorline[sc_Errorline.length] = i+1;
    }
}
//console.log(localvariable);
}


/*Checking for object name correction...*/

function matchobject(check2,objectcheck){
    
    for(j=0;j<objectcheck.length;j++){                
        var matches = check2.indexOf(objectcheck[j]);
        if (matches > -1){
            //alert(matches);
            return matches;
        }        
    }
    return -1;
}
function matchobject1(check2,objectcheck,check3){
    
    for(j=0;j<objectcheck.length;j++){                
        var matches = check2.indexOf(objectcheck[j]);
        if (matches > -1){
            paramcheck(check3,objectcheck[j]);
            return matches;
        }        
    }
    return -1;
}

/*Checking the object type*/

function objecttype(check2){
    var reg = new RegExp('\\b'+check2+'\\b','g');
    
    for(i=0;i<sc_datatypes.length;i++){
        for(j=0;j<sc_datatypes[i].length;j++){
            
            if(sc_datatypes[i] === 'sc_platformer'){
                if(reg.test(sc_platformer[j]) === true){                    
                    return sc_datatypes[i];
                    break;
                }
            }
            if(sc_datatypes[i] === 'sc_topdown'){
                if(reg.test(sc_topdown[j]) === true){    
                    return sc_datatypes[i];
                    break;
                }
            }
            if(sc_datatypes[i] === 'sc_static'){
                if(reg.test(sc_static[j]) === true){
                    return sc_datatypes[i];
                    break;
                }
            }
            if(sc_datatypes[i] === 'sc_gun'){
                if(reg.test(sc_gun[j]) === true){
                    return sc_datatypes[i];
                }
            }
        }
    }
    return 'Invalid Function used with Object type...';
}

function paramcheck(check2,funcname){
    if(funcname === 'follow' || funcname === 'stick'){
        var type = objecttype(check2);
        if(type !== 'sc_platformer' || type !== 'sc_topdown'){
            sc_errorarray[sc_errorarray.length] = 'Use Moveable class Object here';
            sc_Errorline[sc_Errorline.length] = i+1;
        }
    }else if(funcname === 'destory'){
        if(check2 !== ''){
            sc_errorarray[sc_errorarray.length] = 'No parameter required';
            sc_Errorline[sc_Errorline.length] = i+1;
        }
    }else{
        if(Number.isInteger(parseFloat(check2)) === false){
            sc_errorarray[sc_errorarray.length] = 'Parameter Should be Interger';
            sc_Errorline[sc_Errorline.length] = i+1;
        }
    }
}
function ajaxerror(lin,ertxt){
    sc_errorarray[sc_errorarray.length] = ertxt;
    sc_Errorline[sc_Errorline.length] = lin;
}