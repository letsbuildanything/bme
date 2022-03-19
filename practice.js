
// getting Element/tag from html
const table11 = document.querySelector("#table1")
const addBtn = document.querySelector("#add-item")
const selectBtn = document.getElementById('select-item')
const delBtn = document.getElementById('del-item')
const c_name = document.getElementById('customer-name')
const shop_name = document.getElementById('shop-name')


c_name.addEventListener('input', patternCheck)
shop_name.addEventListener('input', patternCheck)

// ---------------pattern check------------

function patternCheck(e){
    let inp_val = e.target.value
    let len = inp_val.length
    if(!((inp_val.charAt(len-1)>='A' && inp_val.charAt(len-1)<='Z') ||
    (inp_val.charAt(len-1)>='a' && inp_val.charAt(len-1)<='z') || 
    (inp_val.charAt(len-1)>='0' && inp_val.charAt(len-1)<='9')||
    (inp_val.charAt(0)==='')||(inp_val.charAt(len-1)===' '))){
        e.target.value = inp_val.slice(0, len-1) + inp_val.slice(len)
        window.alert("Please Enter alphanumeric ('a-z', 'A-z', '0-1') key only")        
    }
        

}




//array for storing table rows;
let rows_value = []

if(localStorage.getItem('rows_value')){
    rows_value = JSON.parse(localStorage.getItem('rows_value'))
}

//values of total column
let totalColArr = []

if(localStorage.getItem('totalColArr')){
    totalColArr = JSON.parse(localStorage.getItem('totalColArr'))
}


const tableNode = table11.querySelector('tbody')
const total_row = table11.querySelector('tfoot')

if(rows_value.length>0){
    total_row.style.display = 'table-row-group'
    total_row.children[0].cells[1].textContent = JSON.parse(localStorage.getItem('total_bill'))
}

//need to pay attention!!!!!!!!!!!!!
if(localStorage.getItem('tablebody')){
    tableNode.innerHTML = JSON.parse(localStorage.getItem('tablebody'))

    for(let i=0; i<tableNode.rows.length; i++){
        const p_node = tableNode.rows[i]
        for(let j=0; j<=table11.rows[0].cells.length; j++){
            if(j<3){
                let input = p_node.cells[j].children[0]
                if(j==0){                    
                    input.value = rows_value[i][j] ? rows_value[i][j] : ""

                    input.addEventListener('input', itemName)

                    function itemName(e){
                        patternCheck(e)

                        let ind1 = input.parentNode.parentNode.rowIndex-1;
                        rows_value[ind1][j] = e.target.value
                        localStorage.setItem('rows_value',JSON.stringify(rows_value))
                    }

                }

                else{
//----------------- need to pay attention ---------------------

                    if(rows_value[i][j])
                        input.value = rows_value[i][j]
                    

                    input.addEventListener('input', function(){
                
                        const price = p_node.cells[1].children[0]
                        const quantity = p_node.cells[2].children[0]
                        const update = p_node.cells[3]
                        let ind1 = input.parentNode.parentNode.rowIndex-1;

                        totalColArr[ind1] = price.value * quantity.value
                        


                        localStorage.setItem('totalColArr', JSON.stringify(totalColArr)) 
                    
                        // update.textContent = price.value * quantity.value
                        update.textContent = totalColArr[ind1]
                        //updating total billing.. last row
                    
                        let totalSum = 0;
                        for(let k=0; k<totalColArr.length; k++){
                            if(totalColArr[k])
                                totalSum += totalColArr[k]
                        }
                    
                        total_row.children[0].cells[1].textContent = totalSum
        
        
                        //storing value for local storage...               
                       
                        rows_value[ind1][j] = p_node.cells[j].children[0].value 
                        localStorage.setItem('rows_value', JSON.stringify(rows_value));
                        localStorage.setItem('total_bill', JSON.stringify(totalSum))
                                   
                    
                        
                    })
                    
                }
            }

            // total column updation
            else if(j==3){
                p_node.cells[3].textContent = totalColArr[i]
            }

            else if(j==4){
                const input = tableNode.rows[i].cells[j].children[0]

                input.addEventListener('change', selectInputListener)

                function selectInputListener(e){
                    if(input.checked){
                        for(let i=0; i<4; i++){
                            if(i<3){
                                p_node.children[i].children[0].style.backgroundColor = 'var(--primary)'
                                
                            }
                            else
                                p_node.children[i].style.backgroundColor = 'var(--primary)'
                        }
        
                    }
        
                    else{
                        for(let i=0; i<4; i++){
                            if(i<3){
                                p_node.children[i].children[0].style.backgroundColor = 'white'
                            }
                            else
                                p_node.children[i].style.backgroundColor = 'white'
                        }
                    }
        
                    // changing focus after it get pressed
                    event.target.blur()
               
                }
        
            }
        }
    }
}
    


//add button

addBtn.addEventListener("click", addButton)

function addButton(e){

    total_row.style.display = 'table-row-group'
    createRow()
    
    // updating count of item
    countItem()

    document.getElementById('btn-container').scrollIntoView();

    // changing focus after it get pressed
    if (document.activeElement != bodytag) {
        document.activeElement.blur()
    }

    let row_length = tableNode.rows.length;
    tableNode.rows[row_length-1].cells[0].children[0].focus();
    
}



function createRow(){
    //creating table row at next row of present rows.
    const t_row = tableNode.insertRow(tableNode.rows.length)
    //for storing value in local storage
    rows_value.push([])
    
// creating cell for created row.
    for(let i=0; i<=table11.rows[0].cells.length; i++){
        // calling function to customize each cell
        createCell(t_row.insertCell(i),i)
    }
    
}

function createCell(t_cell, i){
    if(i<3){
        const input = document.createElement('input')
        const p_node = t_cell.parentNode
   
        //column items
        if(i==0){
            input.setAttribute('type', 'text')
            input.setAttribute('placeholder', 'item name')

            input.addEventListener('input', itemName)

            function itemName(e){
                patternCheck(e)

                let ind1 = input.parentNode.parentNode.rowIndex-1;
                rows_value[ind1][i] = p_node.cells[0].children[0].value
                //local storage
                localStorage.setItem('rows_value', JSON.stringify(rows_value));
                localStorage.setItem('tablebody',JSON.stringify(tableNode.outerHTML)) 
            }
            
        }
        //columns price quantity
        else{
            input.setAttribute('type','number')
            input.setAttribute('placeholder','0')
            input.setAttribute('required', 'true')

            input.addEventListener('input', function(){
                
                const price = p_node.cells[1].children[0]
                const quantity = p_node.cells[2].children[0]
                const update = p_node.cells[3]
                let ind1 = input.parentNode.parentNode.rowIndex-1;
                
                totalColArr[ind1] = price.value * quantity.value
                localStorage.setItem('totalColArr', JSON.stringify(totalColArr)) 
            
                update.textContent = price.value * quantity.value
            
                //updating total billing.. last row
            
                let totalSum = 0;
                for(let i=0; i<totalColArr.length; i++){
                    if(!totalColArr[i]){
                        totalColArr[i] = 0
                    }
                    totalSum += totalColArr[i]
                }
            
                total_row.children[0].cells[1].textContent = totalSum

                let total_bill = totalSum
                localStorage.setItem('total_bill', JSON.stringify(total_bill))


                //storing value for local storage...               
                
                rows_value[ind1][i] = p_node.cells[i].children[0].value 
                localStorage.setItem('rows_value', JSON.stringify(rows_value)); 
                localStorage.setItem('tablebody',JSON.stringify(tableNode.outerHTML)) 
                           
            
                
            })
            
        }
        t_cell.appendChild(input)
    }
    else if(i==4){
        const input = document.createElement('input')
        input.setAttribute('type', 'checkbox')
        t_cell.setAttribute('class', 'selectCell')
        t_cell.appendChild(input)
        const p_node = t_cell.parentNode
        

        input.addEventListener('change', selectInputListener)

        function selectInputListener(e){
            if(input.checked){
                for(let i=0; i<4; i++){
                    if(i<3){
                        p_node.children[i].children[0].style.backgroundColor = 'var(--primary)'
                        
                    }
                    else
                        p_node.children[i].style.backgroundColor = 'var(--primary)'
                }

            }

            else{
                for(let i=0; i<4; i++){
                    if(i<3){
                        p_node.children[i].children[0].style.backgroundColor = 'white'
                    }
                    else
                        p_node.children[i].style.backgroundColor = 'white'
                }
            }

            // changing focus after it get pressed
            event.target.blur()
       
        }

        if(selected)
            t_cell.style.visibility = 'visible'

        
    }
}

//-------------------------------select button------------------------
let selected = false;

 selectBtn.addEventListener('click', selectItem)

function selectItem(){
    if(!selected)    selected = true;
    else   selected = false;
   
    let checkCellColl = document.getElementsByClassName('selectCell')
    let checkCellArr = Array.from(checkCellColl)
   
   for(let i=0; i<checkCellArr.length; i++){
       let checkCell = checkCellArr[i]

       if(selected)
           checkCell.style.visibility = 'visible'
       else{

           let input = checkCell.children[0];
           const p_node = input.parentNode.parentNode;
           if(input.checked){
               
               for(let i=0; i<4; i++){
                   if(i<3){
                       p_node.children[i].children[0].style.background = 'white'
                   }
                   else
                       p_node.children[i].style.background = 'white'
               }
           } 


           input.checked = false;
           checkCell.style.visibility = 'hidden'

       }
           
   }
   localStorage.setItem('selected', JSON.stringify(selected))

   // changing focus after it get pressed
   if (document.activeElement != bodytag) {
    document.activeElement.blur()
}

}

//--------------------------------delete button------------------------
delBtn.addEventListener('click', deleteItem)

function deleteItem(){
    let checkCellColl = document.getElementsByClassName('selectCell')
    let checkCellArr = Array.from(checkCellColl) 
    
    //getting column/cell containing check input 
    if(selected){     
                   
        for(let i=0; i<checkCellArr.length; i++){
            if(checkCellArr[i].children[0].checked){
                //local storage
                const p_node = checkCellArr[i].parentNode
                const row_ind = p_node.rowIndex-1

                rows_value.splice(row_ind, 1)
                totalColArr.splice(row_ind, 1)
                //remove of row
                tableNode.removeChild(checkCellArr[i].parentNode)

                
                
            }
        }

        for(let i=0; i<checkCellArr.length; i++){
            checkCellArr[i].style.visibility = 'hidden'
        }
        selected = false
    }
    

    //deleting when no row is selected
    else if(!selected && tableNode.rows.length>0){
        rows_value.splice(tableNode.rows.length-1, 1)
        totalColArr.splice(tableNode.rows.length-1, 1)
        
        tableNode.removeChild(tableNode.children[tableNode.rows.length-1])
        

    }
        

    let sum = 0;
    for(let i=0; i<totalColArr.length; i++){
        sum += totalColArr[i]
    }

    localStorage.setItem('rows_value', JSON.stringify(rows_value)); 
    localStorage.setItem('totalColArr', JSON.stringify(totalColArr)) 
    total_row.children[0].cells[1].textContent = sum
    localStorage.setItem('total_bill',JSON.stringify(sum))
    localStorage.setItem('tablebody',JSON.stringify(tableNode.outerHTML))
    
    // updating count of item
    countItem()

    // changing focus after it get pressed
    if (document.activeElement != bodytag) {
        document.activeElement.blur()
    }
 
}

//clear button....
const clear = document.getElementById('clr-btn')

clear.addEventListener('click', clearItem)

function clearItem(){
    localStorage.clear()
    tableNode.innerHTML = ''
    rows_value = []
    totalColArr = []

    total_row.children[0].cells[1].textContent = ''
    total_row.style.display = 'none'
    selected = false

    c_name.value = ''
    shop_name.value = ''
    
    // updating count of item
    countItem();

    // changing focus after it get pressed
    if (document.activeElement != bodytag) {
        document.activeElement.blur()
    }
}

/* ---------------------Printbill button----------------------------- */

const download = document.getElementById('download')
const month = ['Jan', 'feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
download.addEventListener('click', printBill)

function printBill(){
// setting date
    const d = new Date();
    let time = d.getHours()+":"+d.getMinutes()
    let dateTime = d.getDate() +" "+ month[d.getMonth()]+" "+ d.getFullYear()+" "+time


    let table_inner_str = document.getElementById('t_head').innerHTML;
    
// checking customer name
    if(!c_name.value){
        window.alert('please write the customer name')
        c_name.focus()
        return
    }

    // checking shop name
    if(!shop_name.value){
        window.alert('please write the shop name')
        shop_name.focus()
        return
    }

    if(rows_value.length==0){
        window.alert("Please add some Item before")
        return
    }

    // taking all the value of table 
    for(let i=0; i<rows_value.length; i++){
        table_inner_str += "<tr>"

        if(rows_value[i].length<3){
            window.alert("Please fill all the fields")
            tableNode.children[i].cells[rows_value[i].length].children[0].focus()
            return
        }
            
        for(let j=0; j<rows_value[i].length; j++){
           if(rows_value[i][j]){
                table_inner_str += `<td>${rows_value[i][j]}</td>`
           } 

           else{
               tableNode.children[i].cells[j].children[0].focus()
               window.alert("Please fill all the fields")
               return
           }
            

            
        }
        table_inner_str += `<td>${totalColArr[i]}</td></tr>`
    }


    let win = window.open("", "", "height=650, width=960")
    win.document.write(`
    <html>
    <head>
    <title>${c_name.value+" "+dateTime}</title>
    
    <style>
        @page { size: auto;  margin: 0mm; }

        * {    
        -webkit-print-color-adjust: exact !important; 
        color-adjust: exact !important; 
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        }

        :root{
            --primary: #1d3c45;
            --secondary: #303134;
            --primaryFont: 'Source Sans Pro', sans-serif;
            --secFont: 'Nunito', sans-serif;
        }

        html, body{
            height: 100%;
            width: 100%;
            
        }

        body{
            padding: 2rem;
        }

        .hero{
            background-color: var(--primary);
            Padding: 1rem 2rem;
        }


        header{
            width: 100%;    
            padding: 1rem 0rem;    
            
        }

        h1{
            color: #d2601a;
            font-family: var(--primaryFont);
        }

        .detail{
            display: grid;
            grid-template-columns: auto auto auto;
            column-gap: 1rem;
            align-items: center;
            padding: 2rem 0rem;
        }

        .detail p{
            color: white;
            text-align: center;
            font-family: var(--secFont);
        }

        table{
            width: 100%;
            text-align: center;
            margin: 1rem 0rem;
        }

        td, th{
            padding: 0.5rem 1rem;
            font-family: var(--secFont);
            font-size: 1.25rem;
        }

        #bill-summary{
            width: 50%;
            border-collapse: collapse;

        }

        #bill-summary td{
            border: 1px solid black;
            font-weight: bold;
            font-size: 1.5rem;
            font-family: var(--primaryFont);
        }


    </style>

    </head> 
    <body>
    
        <div class="hero">
            <header>
                <h1>Billing Made Easy</h1>
            </header>

            <div class="detail">
                <p>${document.getElementById('customer-name').value}</p>
                <p>${document.getElementById('shop-name').value}</p>
                <p>${dateTime}</p>
                
            </div>
        </div>
        
        <table>
        ${table_inner_str}
        </table> 
        <h1>Bill Summary:</h1>
        <table id = "bill-summary">
            <tr>
                <td>Total Item</td>
                <td>${rows_value.length}</td>
            </tr>

            <tr>
                <td>Total Bill</td>
                <td>${JSON.parse(localStorage.getItem('total_bill'))}</td>
            </tr>

        </table>
    </body>
    </html>`)
  
    // win.document.write(`<body> <script type="text/javascript">addEventListener("onload", () => { print(); close(); })</script>
    // <h1 style = "color: yellow">Bill Summary:</h1> <br>`)  
    win.print()
    win.focus()          
    win.document.close()
}


function countItem(){
    let item = document.getElementById('total-item')
    item.textContent = rows_value.length;
}

// updating count of item
countItem()

// shortcut key implementation

document.addEventListener('keypress', logKey);

const bodytag = document.getElementById('wholebody')

function logKey(e){

    if(e.target!=c_name && e.target!=shop_name){
        if(e.key==='Enter'){
            addButton()
        }
    
        if(e.key==='-'){
            deleteItem()
        }
    }
    

    if(e.target===bodytag){
    
        if(e.key==='s'||e.key=='S'){
            selectItem()
        }
    
        if(e.key==='c'||e.key=='C'){
            clearItem()
        }  

        if(e.key==='/'){
            window.alert(`
            press ' Enter ' to Add item
            press ' S ' to Select item
            press ' - ' to Delete item
            press ' C ' to Clear item            
            press ' tab ' to move b/w cells
            press ' ctrl+f ' to search item`)
        }
    }
    
    
}


// smaller screen warning..
const smallScrInfo = document.getElementById('smallscr')

const closeBtn = document.getElementById('close')
closeBtn.addEventListener('click', function(){
    smallScrInfo.style.display = 'none'
})

