const dialog = document.getElementById("dialog-add");
let items = [];
const inputName = document.getElementById("input-name");
const inputAge = document.getElementById("input-age");
const dataTable = document.getElementById("table-data");

document.getElementById("btn-add").onclick = ()=> {
  dialog.style.display = "flex";
}

document.getElementById("btn-confirm").onclick = ()=> {
  dialog.style.display = "none";

  // save item to items
  let item = {};
  item.name = inputName.value;
  item.age = inputAge.value;
  items.push(item);

  // refresh input 
  inputName.value = "";
  inputAge.value = "";
  
  // add dom element
  let tr = document.createElement("tr");
  let name = document.createElement("td");
  name.innerText = item.name;
  tr.appendChild(name);
  let age = document.createElement("td");
  age.innerText = item.age;
  tr.appendChild(age);
  dataTable.appendChild(tr);
  
}

document.getElementById("btn-cancel").onclick = ()=> {
  dialog.style.display = "none";
}

document.getElementById("btn-publish").onclick = ()=> {
  console.log(items);
  // refresh the page
  // location.reload();
}
