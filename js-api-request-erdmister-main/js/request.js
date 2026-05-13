
var data ={}
var xhr = new XMLHttpRequest();
var requestUrl = "https://fakestoreapi.com/products";
tbody= document.getElementById("tableBodyData");
btnRemove=document.getElementById("btnRemove");
btnRemove.addEventListener("click",function(e){
    tbody.innerHTML = "";
});

//consumir api
function getData() {
    xhr.open("GET", requestUrl, true); 
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            let array = JSON.parse(xhr.responseText);
            data.json = array; 
            tbody.innerHTML = "";

            data.json.forEach(element => {
                tbody.append(genTr(element));
            });
        }
    };
    xhr.send();
}

function genTr(json) {
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let td5 = document.createElement("td");

    td1.innerText = json.id;
    td2.innerText = json.title;
    td3.innerText = json.price;
    td4.innerText = json.description;
    td5.innerText = json.category;
    tr.append(td1, td2, td3, td4, td5);

    return tr;
}

const btnLoad = document.getElementById("btnLoad");

// Le asignamos el evento click
btnLoad.addEventListener("click", function() {
    getData();
});

const inputSearch = document.getElementById("inputSearch");
const btnSearch = document.getElementById("btnSearch");

btnSearch.addEventListener("click", function () {
    let query = inputSearch.value.toLowerCase();
    let filtered = data.json.filter(function (element) {
        return element.title.toLowerCase().includes(query);
    });

    tbody.innerHTML = "";

    filtered.forEach(element => {
        tbody.append(genTr(element));
    });

    console.log("Resultados encontrados:", filtered);
});