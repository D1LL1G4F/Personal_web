"use strict";
/*
 * Author: Matej Kňazík
 * Email: mato.knazik@gmail.com
 * Date: February 2018
 */


//gets user window height
var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// called when page is loaded
async function displayPage() {
  await sleep(314);
  document.getElementById("content").style.display = "block";
  scrollPage(0);
  loopList("Interests",1,4,11);
  loopList("progLang",0,6,10);
  loopImg(59,19,"en","ger","cz","sk");
}

/*
 * function for changing ascii image with cool transition
 *
 * first param: width of ascii image (in characters)
 * second param: height of ascii image (in characters)
 * next params: are IDs of objects containing image as childNodes[1]
  *
*/
async function loopImg(width, height, ...langs) {
  var cnt = 1;
  var elems = [];
  for (var i = 0; i < langs.length; i++) {
    document.getElementById(langs[i]).style.display = "none"; // hide all images
    elems[i] = document.getElementById(langs[i]).childNodes[1].innerHTML; // load them to array
  }
  var targetElem = document.getElementById(langs[0]); // select first as target

  targetElem.style.display = "block"; // display selected img
  var numOfImg = elems.length;

  window.setInterval(changeImg, 3000); // change img every 3sec
  async function changeImg() {
    await transformImgEffect(10,width,height,targetElem);
    targetElem.childNodes[1].innerHTML = elems[cnt%numOfImg];
    cnt++;
  }
}

// transforming effect
async function transformImgEffect(rep,width,height,elem) {
  for (var i = 0; i < rep; i++) { // shuttle
    elem.childNodes[1].innerHTML = randomImgAscii(width,height);
    elem.childNodes[1].innerHTML = randomColor(elem.childNodes[1]);
    await sleep(80);
  }
}

function randomColor(elem) {
    var txt = elem.textContent;
    var newText = "";

    for(var i=0, l=txt.length; i<l; i++)
    {
        newText += txt.charAt(i).fontcolor(getRandColor());
    }
    return newText;
}

function getRandColor()
{
  var colorString="";
  for(var i=0;i<6;i++)
  {
    var num = Math.floor(Math.random()*17);
    var hexNum = num.toString(16);
    colorString += hexNum;
  }
  return colorString;
}

function randomImgAscii(width,height) {
    var text = "";
    var possible = "./#$%!@*&(),";
    var length = (height*width)-height;


    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    for (var i = 1; i <= Math.floor(length/width); i++) {
      text = text.substr(0, (i*width)-1) + '\n' + text.substr(i*width-1);
    }
    return text;
}



async function loopList(elem,start,end,rep) {
  var cnt = start+1;
  var intr = [];

  for (var i = start; i < end+1; i++) {
    intr[i-start] = document.getElementById(elem).childNodes[i].innerHTML;

  }

  for (var i = start+1; i < end+1; i++) {
    document.getElementById(elem).childNodes[i].innerHTML = "";
  }

  window.setInterval(changeItem, 3000);
  async function changeItem() {
    await transformStr(rep,document.getElementById(elem).childNodes[start],intr[cnt%((end-start)+1)]);
    cnt++;
  }
}

function selectMenuOpt(opt) {
  let arr = [ "0%", "0%", "0%", "0%" ];

  arr[opt - 1] = "100%";

  [ document.getElementById("lineA").style.width
  , document.getElementById("lineB").style.width
  , document.getElementById("lineC").style.width
  , document.getElementById("lineD").style.width
  ] = arr;
}

async function scrollPage(yOffset) {
  window.scrollTo(0, yOffset,'smooth');

  selectMenuOpt(1 + Math.floor(yOffset / height));
}

function menuSelector() {

  if(document.documentElement.scrollTop < height*0.7) {
    selectMenuOpt(1);
  } else if (document.documentElement.scrollTop < height*1.7) {
    selectMenuOpt(2);
  } else if (document.documentElement.scrollTop < height*2.7) {
    selectMenuOpt(3);
  } else {
    selectMenuOpt(4);
  }

  return;
}

window.addEventListener('resize', function(event){
  height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
});

function randomStr(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

/*
 * function for transforming string with random hashing effect
 *
 * First param: is number of loops that should appear (1 loop is 80ms long)
 * Next params: are pair where first is object of elemnt containing string and
 *              second is required string
 * Pre condition: (length of string) - (num of preserved chars) <= (number of loops)
 * note: number of param pairs can be optional
*/
async function transformStr() {
  if (arguments.length < 3 || !(arguments.length % 2)) {
    console.log("Error: invalid arguments in funcion hashDelStrings");
    return;
  }


  var minRep = [];
  for (var i = 1; i < arguments.length; i+=2) {
    minRep[Math.floor(i/3)] = arguments[i].innerHTML.length - arguments[i+1].length;
    if (arguments[0] < Math.abs(minRep[Math.floor(i/3)])) {
      console.log("Error: argument[0] of hashDelStrings must be bigger!");
      return;
    }
  }

  for (var i = 0; i < arguments[0]; i++) { // shuttle
    for (var j = 0; j < ((arguments.length-1)/2); j++) {
      var str = arguments[j*2+1];
      var required = arguments[(j*2)+2].length;
      str.innerHTML = randomStr(str.innerHTML.length);

      if (minRep[j] >= 0) { // decide whenever add char or delete
        if (str.innerHTML.length > required) { // delete one char if needed
          str.innerHTML = str.innerHTML.slice(0,str.innerHTML.length - 1);
        }
      } else {
        if (str.innerHTML.length < required) {
            str.innerHTML =  randomStr(str.innerHTML.length + 1);
        }
      }
    }
    await sleep(80);
  }

  for (var i = 0; i < arguments[0]; i++) { // display required
    for (var j = 0; j < ((arguments.length-1)/2); j++) {
      var str = arguments[j*2+1];
      str.innerHTML = arguments[(j*2)+2];
      }
    }

  return new Promise(resolve => setTimeout(resolve, 0));
}
