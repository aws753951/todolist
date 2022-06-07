// 這裡的tag順序，照寫並加空格即可
let add = document.querySelector("form button");
let section = document.querySelector("section");

add.addEventListener("click", (e) => {
  // preventDefault()記得加()，避免點完後就不見了
  e.preventDefault();
  //   取得送出內的值，從button出發(可能已經打好了)，往上再往下找，可以鎖定你要的框框並取得你要的值
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDate = form.children[2].value;

  // 如果沒填，跳出通知並return掉，讓下面的程式碼都不會再執行
  if (todoText === "") {
    alert("請填資料");
    return;
  }

  //   把送出的資料，建立成另一個框框呈現出來***************************************
  let todo = document.createElement("div");
  todo.classList.add("todo");
  let text = document.createElement("p");
  text.classList.add("todo-text");
  //   這裡class不用特別標記
  text.innerText = todoText;
  let date = document.createElement("p");
  date.classList.add("todo-date");
  date.innerText = todoMonth + " / " + todoDate;

  todo.appendChild(text);
  todo.appendChild(date);

  // 創造勾勾與垃圾筒的icon
  let completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
  // 點了勾勾後要新增觸發條件，然而點了勾勾有可能點到 i 或者 button，需在css設定i，得設定pointer-events: none;
  completeButton.addEventListener("click", (e) => {
    // 他的parent為div.todo → 點了後變成 div.todo done ，並於css設定.done的設定
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
  });

  let trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

  trashButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.style.animation = "scaleDown 0.3s forwards";

    todoItem.addEventListener("animationend", () => {
      let text_local = todoItem.children[0].innerText;
      // 一開始設定的時候不會有，但下方的null判斷時，則會產生出來，所以回頭來這邊設定
      let mylist = JSON.parse(localStorage.getItem("mylist"));
      mylist.forEach((n, index) => {
        if (n["todoText"] == text_local) {
          mylist.splice(index, 1);
          localStorage.setItem("mylist", JSON.stringify(mylist));
        }
      });

      todoItem.remove();
    });
  });

  todo.appendChild(completeButton);
  todo.appendChild(trashButton);

  // 新增動畫的特效 scaleUp可亂寫名稱沒關係，於css內要寫@keyframe
  todo.style.animation = "scaleUp 0.3s forwards";

  //   記得於前面寫出section，才能把todo這個變數append上去
  section.appendChild(todo);
  //   把送出的資料，建立成另一個框框呈現出來*************************************** 記得去scss修改

  // 清除已經填入的資料
  form.children[0].value = "";

  // 儲存別人寫好的資料，用localstorage
  // 在這之前，先設定個object，之後儲存這個object(不用"")
  let myTodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate,
  };

  // 但是使用getitem時，要設定""
  let mylist = localStorage.getItem("mylist");
  if (mylist == null) {
    // 記得設定成array，讓之後讀取時可以push上去
    localStorage.setItem("mylist", JSON.stringify([myTodo]));
  } else {
    mylist = JSON.parse(mylist);
    mylist.push(myTodo);
    localStorage.setItem("mylist", JSON.stringify(mylist));
  }
});

// 若localStorage有資料，則建立並填入其相關資料

function loadData() {
  let mylist = localStorage.getItem("mylist");
  if (mylist !== null) {
    mylist = JSON.parse(mylist);
    // 由於需要拿出每array中每一個boject，用forEach
    mylist.forEach((n) => {
      // 由於CSS寫好了，所以照抄之前的創建的格式去使用
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todo-text");
      // 讀取object中的資料，可用[]或者.
      text.innerText = n["todoText"];
      let date = document.createElement("p");
      date.classList.add("todo-date");
      date.innerText = n.todoMonth + " / " + n.todoDate;

      todo.appendChild(text);
      todo.appendChild(date);

      let completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';

      completeButton.addEventListener("click", (e) => {
        // 他的parent為div.todo → 點了後變成 div.todo done ，並於css設定.done的設定
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
      });

      let trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

      trashButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.style.animation = "scaleDown 0.3s forwards";

        todoItem.addEventListener("animationend", () => {
          // 設定刪除後也會把localstorage刪掉
          // 刪掉後上面也要再設定一次，等同一個是開啟視窗，若有local，建立div時要附加垃圾桶條件
          let text_local = todoItem.children[0].innerText;
          let mylist = JSON.parse(localStorage.getItem("mylist"));
          mylist.forEach((n, index) => {
            if (n["todoText"] == text_local) {
              mylist.splice(index, 1);
              localStorage.setItem("mylist", JSON.stringify(mylist));
            }
          });

          todoItem.remove();
        });
      });

      todo.appendChild(completeButton);
      todo.appendChild(trashButton);

      section.appendChild(todo);
    });
  }
}

loadData();

function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;
  let count = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      console.log(result);
      count++;
      console.log(count);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      console.log(result);
      count++;
      console.log(count);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        console.log(result);
        count++;
        console.log(count);
        j++;
      } else {
        result.push(arr1[i]);
        console.log(result);
        count++;
        console.log(count);
        i++;
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    console.log(result);
    count++;
    console.log(count);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    console.log(result);
    count++;
    console.log(count);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  // sort data
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("mylist")));
  localStorage.setItem("mylist", JSON.stringify(sortedArray));

  // remove data
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  // load data
  loadData();
});
