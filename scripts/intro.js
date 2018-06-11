/*
 * Author: Matej Kňazík
 * Email: mato.knazik@gmail.com
 * Date: February 2018
 */

function removeStaticBackground() {
  document.getElementById("content").style.transition = "outline 8s linear";
  document.getElementById("content").style.transitionDelay = "0.5s";
  document.getElementById("content").style.outline = "solid 1000px black";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
 * note2: function must be called as 'await hashDelStrings(...)'';
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
      str.innerHTML = randomStr(str.innerHTML.length)

      if (required >= 0) { // decide whenever add char or delete
        if (str.innerHTML.length > required) { // delete one char if needed
          str.innerHTML = str.innerHTML.slice(0,str.innerHTML.length - 1);
        }
      } else {
        if (str.innerHTML.length < required) {
            str.innerHTML =   str.innerHTML + randomStr(1);
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

async function displayEnter() {
  var h1 = document.getElementById("firstLine");
  var h2 = document.getElementById("secontLine");

  await sleep(3100);
  await transformStr(32,h1,"ENTER",h2,"");
  document.getElementById("banner").href="main.html";
  document.getElementById("banner").style.cursor="pointer";

  return;
}

var entrance = ( function () { // entrance() can be called only once
    var executed = false; // closure

    return function () {
      if (!executed) {
        removeStaticBackground();
        displayEnter();
        executed = true;
      }
    };
})();

function displayPage() {
  document.getElementById("background").style.display = "block";
}
