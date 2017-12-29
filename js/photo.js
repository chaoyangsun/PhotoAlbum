//一个分页显示的照片数量
let count = 6;
//当前页
let currentPage = 1;
//选中的页码dom
let predoma;
//当前点击的相册边栏
let currentSelectingLeftDom;
// 当前展示的相册内容
let currentContent;
//默认的相册
let defaultLeft = document.querySelector(".left > div:first-child");
currentSelectingLeftDom = defaultLeft;

//默认的相册内容
let defaultMain = document.querySelector(".main > div:last-of-type");

currentContent = defaultMain;
let defaultAll = new Array();
//删除指定元素
Array.prototype.removeByValue = function(val) {
  for(var i=0; i<this.length; i++) {
    if(this[i] == val) {
      this.splice(i, 1);
      break;
    }
  }
}


let adoms = document.querySelectorAll("nav > a");
let content = document.querySelector(".content");

let navPhoto = document.querySelector(".photo_album");
navPhoto.style.backgroundColor = "#ddd";
navPhoto.style.color = "#333";
let strBtn = `
<li><a href="#"></a></li>
`;

let str = `
<div class="img">
  <img src="../img/product.png" alt="" class="photo">
  <img src="../img/del.png" alt="" class="del_photo">
</div>
`;
let imgIndex = 0;
//初始化
function init() {
  for (var i = 1; i < 12; i++) {
    document.querySelector(".main > header+div ").insertAdjacentHTML("beforeEnd", str);
    let divdom = document.querySelector(".main > header+div > div:last-of-type");
    let del_photoDom = divdom.querySelector("img:last-child");
    del_photoDom.setAttribute("class", "del_hid");
    let newImg = divdom.querySelector("img:first-child");
    newImg.setAttribute("class", `${++imgIndex}`);
    newImg.setAttribute("src", `../img/${i}.png`);
    addArr(divdom);
  }
}
init();

//导航栏点击事件
adoms.forEach(item => {
  item.addEventListener("click", function() {
    clickNav(item);
  });
});

let preDom = navPhoto;

function clickNav(item) {
  if (preDom) {
    preDom.style.backgroundColor = "rgb(250,250,250)";
    preDom.style.color = "#3366FF";
  }
  preDom = item;
  item.style.backgroundColor = "#ddd";
  item.style.color = "#333";

  switch (item.className) {
    case "photo_album":
      content.style.display = "block"; //显示相册
      currentPage = 1;
      break;
    default:
      content.style.display = "none"; //点击其他 隐藏相册
      currentPage = 2;
  }
}

//创建相册
let createPhoto = document.querySelector(".a-create");
let defaultItem = document.querySelector(".left > .defaultAll").outerHTML;
let index = 0;

createPhoto.addEventListener("click", function() {
  var result = window.prompt("请输入相册名字", "");
  if (result) {
    document.querySelector(".left").insertAdjacentHTML("beforeEnd", defaultItem);
    //最新创建的相册边栏
    let divDom = document.querySelector(".left > div:last-of-type");
    divDom.setAttribute("class", "main" + (++index));
    var defineStr = divDom.className;
    eval(defineStr + "=new Array()");
    // eval("var " + divDom.className + "=new Array()");
    // console.log(main1);
    divDom.querySelector("span").innerHTML = result;
    divDom.querySelector("img:first-child").setAttribute("class", "def");
    divDom.querySelector("img:last-of-type").setAttribute("class", "del");
    addDelListener(divDom);
  }
});

//相册点击 删除相册
function addDelListener(item) {
  //删
  item.querySelector("img:last-of-type").addEventListener("click", function(e) {
    e.stopPropagation();
    if(confirm("确认删除吗?")){
      item.remove();
      if (item == currentSelectingLeftDom) {
        currentSelectingLeftDom = null;
      }
      // console.log(currentSelectingLeftDom);
      defaultShow();
    }
  });
  //点击
  item.addEventListener("click", function() {
    if (currentSelectingLeftDom != item) {
      // console.log("bububub");
      currentPage = 0;
    }
    // console.log(currentSelectingLeftDom);
    // console.log(currentContent);
    //为相册对应的内容div设置class
    document.querySelector(".main > div:last-of-type").setAttribute("class", item.className);
    let current = document.querySelector(`.main > div.${item.className}`);
    // current.innerText = item.innerText;
    currentContent = current;
    document.querySelector(".photo_title").innerText = item.innerText;
    // .insertAdjacentText("beforeEnd", item.innerText);
    //当前点击的相册
    currentSelectingLeftDom = item;
    setBackground(currentSelectingLeftDom);
    showPhoto();
  });
}

function defaultShow() {
  if (currentSelectingLeftDom) {
    let current = document.querySelector(`.main > div.${currentSelectingLeftDom.className}`);
    currentContent = current;
    document.querySelector(".photo_title").innerText = currentSelectingLeftDom.innerText;
  } else {
    currentContent = defaultMain;
    currentSelectingLeftDom = defaultLeft;
    currentPage = 0;
    document.querySelector(".photo_title").innerText = defaultLeft.innerText;
  }
  setBackground(currentSelectingLeftDom);
  showPhoto();
}

//默认相册的点击
defaultLeft.addEventListener("click", function() {
  if (currentSelectingLeftDom != defaultLeft) {
    currentPage = 0;
  }
  defaultMain.setAttribute("class", "defaultAll");
  currentContent = defaultMain;
  currentSelectingLeftDom = defaultLeft;
  document.querySelector(".photo_title").innerText = defaultLeft.innerText;
  setBackground(currentSelectingLeftDom);
  showPhoto();
});

//设置左边框的点击效果
let preBackItem;
function setBackground(item) {
  if (preBackItem) {
    preBackItem.style.backgroundColor = "#fff";
  }
  preBackItem = item;
  item.style.backgroundColor = "#eee";
}
setBackground(currentSelectingLeftDom);

//显示照片
function showPhoto() {
  currentContent.innerHTML = "";
  currentPage = Math.ceil(eval(currentSelectingLeftDom.className).length / count);
  console.log("currentPage = " + currentPage);
  goPage(eval(currentSelectingLeftDom.className).length, currentPage);
  eval(currentSelectingLeftDom.className).forEach(item => {
    if (item) {
      currentContent.appendChild(item);
      chooseNewPage();
    }
  });
}
showPhoto();

//上传照片
let upPhoto = document.querySelector("#file");
upPhoto.addEventListener("change", function(e) {
  let file = e.target.files[0];
  let fr = new FileReader();
  fr.onload = function() {
    if (currentContent.childElementCount == 0) {
      setPage();
    }
    let img = fr.result;
    document.querySelector(".main > header+div ").insertAdjacentHTML("beforeEnd", str);
    let divdom = document.querySelector(".main > header+div > div:last-of-type");
    let newImg = divdom.querySelector("img:first-child");
    newImg.setAttribute("class", `${++imgIndex}`);
    newImg.src = img;

    let del_photoDom = divdom.querySelector("img:last-child");
    del_photoDom.addEventListener("click", function () {
      if(confirm("确认删除吗?")){
        divdom.remove();
        delArr(divdom);
      }
    });

    addArr(divdom);
  }
  fr.readAsDataURL(file);
});

//数组 增
function addArr(item) {
  // console.log(currentSelectingLeftDom.className);
  if (currentSelectingLeftDom.className != "defaultAll") {
    defaultAll.push(item);
  }
  // currentContent.appendChild(divdom);
  eval(currentSelectingLeftDom.className).push(item);
  showPhoto();
}
//数组 删
function delArr(item) {
  // console.log(currentSelectingLeftDom.className);
  if (currentSelectingLeftDom.className != "defaultAll") {
    defaultAll.removeByValue(item);
  }
  // currentContent.appendChild(divdom);
  eval(currentSelectingLeftDom.className).removeByValue(item);
  showPhoto();
}


//分页
function goPage(total, pages) {
  changeBtn(pages);
  topage();
}

function topage() {
  let total = currentContent.childElementCount;
  let start = (currentPage - 1) * count;
  let end = currentPage * count;
  console.log(start + " -- " + end);
  for (let i = 1; i <= total; i++) {
    let dom = currentContent.querySelector(`div:nth-of-type(${i})`);
    if (i > start & i <= end) {
      dom.setAttribute("class", "img_show");
    } else {
      dom.setAttribute("class", "img_hidden");
    }
  }
}

//动态处理 页码按钮
function changeBtn(p) {
  //处理 隐藏与显示
  let uldom = document.querySelector("footer > ul");
  if (p == 0 & eval(currentSelectingLeftDom.className).length == 0) {
    uldom.setAttribute("class", "pagination_hid");
    return;
  } else {
    uldom.setAttribute("class", "pagination");
  }

  //处理 按钮的删减
  let num = document.querySelector("footer > ul").childElementCount;
  if (num > p + 4) {
    for (var i = p + 2 + 1; i <= num - 2; i) {
      document.querySelector(`footer > ul > li:nth-child(${i})`).remove();
      num = document.querySelector("footer > ul").childElementCount;
    }
  }

  //处理 页码的增加与点击
  num = document.querySelector("footer > ul").childElementCount;
  for (let i = num - 4 + 1; i <= p; i++) {
    document.querySelector("footer > ul > li:nth-last-child(2)").insertAdjacentHTML("beforeBegin", strBtn);
    let dom = document.querySelector("footer > ul > li:nth-last-child(3) > a");
    dom.innerText = i;
    dom.addEventListener("click", function() {
      if (predoma) {
        predoma.setAttribute("class", "");
      }
      predoma = dom;
      dom.setAttribute("class", "active");
      currentPage = dom.innerText;
      topage();
    });
  }
  chooseNewPage();
}

//初始化 四个固定点击按钮的点击 与显示
function setPage() {
  let uldom = document.querySelector(".pagination_hid");
  if (uldom) {
    uldom.setAttribute("class", "pagination");
  } else {
    uldom = document.querySelector(".pagination");
  }
  predoma = document.querySelector(`.pagination > li:nth-child(${currentPage + 2}) > a`);
  for (var i = 1; i <= 4; i++) {
    let dom = document.querySelector(`.pagination > li:nth-child(${i}) > a`);
    dom.addEventListener("click", function() {
      let total = uldom.childElementCount;
      switch (dom.innerText) {
        case "首页":
          currentPage = 1;
          break;
        case "上一页":
          currentPage = (--currentPage > 1) ? currentPage : 1;
          break;
        case "下一页":
          currentPage = (++currentPage < total - 4) ? currentPage : total - 4;
          break;
        case "尾页":
          currentPage = total - 4;
          break;
        default:
          return;
      }
      chooseNewPage();
    });
  }
}

//选中新的分页
function chooseNewPage() {
  if (predoma) {
    predoma.setAttribute("class", "not");
  }
  // console.log(currentPage);
  let newdom = document.querySelector(`.pagination > li:nth-child(${currentPage + 2}) > a`);
  if (newdom) {
    predoma = newdom;
    newdom.setAttribute("class", "active");
  }
  topage();
}
