let itm_name_inpt
let itm_quan_inpt
let itm_des_inpt

let sub_btn

let err_ele
let suc_ele
let itm_list_area

let current_item_selected

let items_list = [];
let archived_items = [];
let transaction_history = [];

// when page loads
document.addEventListener("DOMContentLoaded", () => {
    itm_name_inpt = document.getElementById("item_name")
    itm_quan_inpt = document.getElementById("item_quantity")
    itm_des_inpt = document.getElementById("item_description")

    sub_btn = document.getElementById("add_btn")

    // alerts
    err_ele = document.getElementById("err_ele")
    suc_ele = document.getElementById("suc_ele")

    // getList()

    // when the add button is pressed
    sub_btn.addEventListener("click", () => {
        formState()
        reset()
    })

    updateDashboard()
})

// input random data test
document.addEventListener("keydown", (key) => {
    if (key.key == "K") {
        itm_name_inpt.value = "Testing"
        itm_quan_inpt.value = 34
        itm_des_inpt.value = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed corporis, error vero dolorum ratione, eius nihil, eaque recusandae quas temporibus quam blanditiis explicabo sunt est quos unde voluptatum nam quisquam."
    }
})

function formState() {
    if (sub_btn.innerHTML == "Add") {
        addItem(itm_name_inpt.value, itm_quan_inpt.value, itm_des_inpt.value)
    } else {
        UpdateItem(current_item_selected);
    }
}

function reset() {
    itm_name_inpt.value = ""
    itm_quan_inpt.value = ""
    itm_des_inpt.value = ""
}

function getList() {
    itm_list_area = document.getElementById("item_list")

    // reset the list
    itm_list_area.innerHTML = ""

    items_list.forEach((item, index) => {
        let card = document.createElement("div");
        card.classList.add("item");

        card.innerHTML = `
        <div class="d-flex js-cn-btw">
            <span>${item.id}</span>
            <span>${item.name}</span>
            <span>${item.quantity}</span>
        </div>
        <br>
        <span class="description">${item.description}</span>
        <br>
        <!-- buttons -->
        <div class="d-flex js-cn-btw">
            <button type="button" onclick="editItem(${item.id})">Edit</button>
            <button type="button" onclick="archiveItem(${item.id}, ${index})">Archive</button>
        </div>
        `;

        itm_list_area.appendChild(card)
    });
}

function getArchiveList() {
    const arch_list = document.getElementById("archive_list")

    // reset the list
    arch_list.innerHTML = ""

    archived_items.forEach((item, index) => {
        let row = document.createElement("tr");

        row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.date}</td>
        <th>
            <button onclick="restoreItem(${item.id}, ${index})">Restore</button>
        </th>
        `;

        arch_list.appendChild(row)
    });
}

function addItem(item_name, item_quantity, item_description) {
    let i_id = Math.round(Math.random() * 1000);

    if (!item_name || !item_quantity || !item_description) {
        // console.log("Fill in the input")
        err_ele.innerHTML = "Fill in all the inputs."
        return
    }

    if (checkItemExist(item_name)) {
        return;
    }

    const item = {
        id: i_id,
        name: item_name,
        quantity: item_quantity,
        description: item_description
    }
    // storing data
    items_list.push(item)
    err_ele.innerHTML = ""
    getList()

    listNewAction("Adding New Item", "New Item " + item.name + " has been added in the inventory")
}

function checkItemExist(item_name) {
    // check if the item exist already
    const check_item = items_list.find(item => item.name === item_name)
    // console.log(check_item)
    if (check_item) {
        err_ele.innerHTML = "Item already existed!"
        return true;
    }

    return false;
}

function editItem(id) {

    // editing data
    let edit_item = items_list.find(item => item.id === id)
    if (edit_item) {
        // add dates updated
        itm_name_inpt.value = edit_item.name
        itm_quan_inpt.value = edit_item.quantity
        itm_des_inpt.value = edit_item.description

        sub_btn.innerHTML = "Update Item"
        current_item_selected = id
        return;
    }

    err_ele.innerHTML = "Item dosent exist!"
}

function UpdateItem(id) {
    let item_name = itm_name_inpt.value;
    let item_quantity = itm_quan_inpt.value;
    let item_description = itm_des_inpt.value;

    if (!item_name || !item_quantity || !item_description) {
        err_ele.innerHTML = "Empty edit inputs"
        return
    }

    err_ele.innerHTML = ""
    sub_btn.innerHTML = "Add"

    // editing data
    let edit_item = items_list.find(item => item.id === id)
    if (edit_item) {
        edit_item.name = item_name;
        edit_item.quantity = item_quantity;
        edit_item.description = item_description;
        // add dates updated
    }

    getList();
    listNewAction("Item Update", "Item " + edit_item.name + " has been updated")
}

function archiveItem(id, index) {
    const item = items_list.find(item => item.id === id)

    const d = new Date();

    if (item && confirm("Are you sure u wanna archive this item? " + item.name)) {
        suc_ele.innerHTML = 'Item has been archived!'

        // removing from the main list
        items_list.splice(index, 1);

        const arch_item = {
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            description: item.description,
            date: d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate(),
        }

        // storing data
        archived_items.push(arch_item)

        getList();
    }

    getArchiveList();

    listNewAction("Archiving", "Archiving Item " + item.name)
}

function restoreItem(id, index) {
    const item = archived_items.find(item => item.id === id)

    if (!item) {
        return
    }

    const restore_item = {
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        description: item.description,
    }

    // removing from the main list
    archived_items.splice(index, 1);

    console.log(restore_item)

    // storing data
    items_list.push(restore_item)

    suc_ele.innerHTML = 'Item has been Restored!'
    getList()
    getArchiveList()

    listNewAction("Restoring", "Restoring Archive Item " + item.name)
}

function listNewAction(action, purpuse) {
    let i_id = Math.round(Math.random() * 100000);
    const d = new Date();

    const history = {
        id: i_id,
        action: action,
        purpuse: purpuse,
        description: item_description,
        date_and_time: d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "/" + d.getTime()
    }
    // storing data
    transaction_history.push(history)
    getHistory()
    updateDashboard()
}

function getHistory() {
    const hist_list = document.getElementById("trans_history")

    // reset the list
    hist_list.innerHTML = ""

    transaction_history.forEach((item, index) => {
        let row = document.createElement("tr");

        row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.action}</td>
        <td>${item.purpuse}</td>
        <td>${item.date_and_time}</td>
        `;

        hist_list.appendChild(row)
    });
}

function updateDashboard() {
    const t_item = document.getElementById("t-itm-sh")
    const t_quantity = document.getElementById("t-qnt-sh")
    const t_datetoday = document.getElementById("t-dt-sh")

    t_item.innerHTML = items_list.length
    
    let total_q = 0
    items_list.forEach(item => {
        total_q += parseInt(item.quantity)
    });
    t_quantity.innerHTML = total_q

    const d = new Date();
    t_datetoday.innerHTML = d
}
