/****************************************************
 * ระบบบันทึกรายรับ - รายจ่าย
 * Version 1.0
 * Author : ChatGPT
 ****************************************************/

/***********************
 * CONFIG
 ************************/

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwbpO20Kw0UESWj-gyrAkeKCOaDgE98MwuW1ubReAUVONKhIFu9-EXVD8QJlWNvDx-x/exec"; // ใส่ URL ของ Google Apps Script ใน Part 2

/***********************
 * ELEMENTS
 ************************/

const incomeDate = document.getElementById("incomeDate");
const incomeItem = document.getElementById("incomeItem");
const incomeAmount = document.getElementById("incomeAmount");
const incomeGroup = document.getElementById("incomeGroup");

const expenseDate = document.getElementById("expenseDate");
const expenseItem = document.getElementById("expenseItem");
const expenseAmount = document.getElementById("expenseAmount");
const expenseGroup = document.getElementById("expenseGroup");

const btnIncome = document.getElementById("saveIncome");
const btnExpense = document.getElementById("saveExpense");

const loading = document.getElementById("loading");
const message = document.getElementById("message");

/***********************
 * INITIAL
 ************************/

document.addEventListener("DOMContentLoaded", () => {

    setToday();

    initDarkMode();

    addEvents();

});

/***********************
 * EVENT
 ************************/

function addEvents(){

    btnIncome.addEventListener("click", saveIncome);

    btnExpense.addEventListener("click", saveExpense);

    incomeAmount.addEventListener("blur", formatMoneyInput);

    expenseAmount.addEventListener("blur", formatMoneyInput);

    document.addEventListener("keydown", enterKeySave);

}

/***********************
 * SET TODAY
 ************************/
function formatThaiShortDate(dateString){

    const date = new Date(dateString + "T00:00:00");

    const months = [
        "ม.ค",
        "ก.พ",
        "มี.ค",
        "เม.ย",
        "พ.ค",
        "มิ.ย",
        "ก.ค",
        "ส.ค",
        "ก.ย",
        "ต.ค",
        "พ.ย",
        "ธ.ค"
    ];

    const day = String(date.getDate()).padStart(2, "0");

    const month = months[date.getMonth()];

    const year = date.getFullYear();

    return `${day}/${month}/${year}`;

}

function setToday(){

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    const todayISO =
        `${year}-${month}-${day}`;

    incomeDate.value = todayISO;

    expenseDate.value = todayISO;

}

/***********************
 * ENTER
 ************************/

function enterKeySave(e){

    if(e.key !== "Enter") return;

    if(document.activeElement.closest(".income-card")){

        saveIncome();

    }

    if(document.activeElement.closest(".expense-card")){

        saveExpense();

    }

}

/***********************
 * VALIDATION
 ************************/

function validateIncome(){

    if(incomeDate.value===""){

        showError("กรุณาเลือกวันที่");

        incomeDate.focus();

        return false;

    }

    if(incomeItem.value.trim()===""){

        showError("กรุณากรอกชื่อรายการ");

        incomeItem.focus();

        return false;

    }

    if(incomeAmount.value==="" || Number(incomeAmount.value)<=0){

        showError("กรุณากรอกจำนวนเงิน");

        incomeAmount.focus();

        return false;

    }

    if(incomeGroup.value===""){

        showError("กรุณาเลือกกลุ่ม");

        incomeGroup.focus();

        return false;

    }

    return true;

}

/***********************
 * VALIDATE EXPENSE
 ************************/

function validateExpense(){

    if(expenseDate.value===""){

        showError("กรุณาเลือกวันที่");

        expenseDate.focus();

        return false;

    }

    if(expenseItem.value.trim()===""){

        showError("กรุณากรอกชื่อรายการ");

        expenseItem.focus();

        return false;

    }

    if(expenseAmount.value==="" || Number(expenseAmount.value)<=0){

        showError("กรุณากรอกจำนวนเงิน");

        expenseAmount.focus();

        return false;

    }

    if(expenseGroup.value===""){

        showError("กรุณาเลือกกลุ่ม");

        expenseGroup.focus();

        return false;

    }

    return true;

}

/***********************
 * FORMAT NUMBER
 ************************/

function formatMoneyInput(e){

    let value = e.target.value;

    if(value === "") return;

    value = value.replace(/,/g, "");

    const number = Number(value);

    if(isNaN(number)){

        e.target.value = "";

        return;

    }

    e.target.value = number.toLocaleString("en-US", {

        minimumFractionDigits: 2,
        maximumFractionDigits: 2

    });

}
/***********************
 * LOADING
 ************************/

function showLoading(){

    loading.style.display="block";

    btnIncome.disabled=true;

    btnExpense.disabled=true;

}

function hideLoading(){

    loading.style.display="none";

    btnIncome.disabled=false;

    btnExpense.disabled=false;

}

/***********************
 * MESSAGE
 ************************/

function showSuccess(text){

    message.className="message success";

    message.innerHTML="✅ "+text;

    setTimeout(()=>{

        message.className="message";

        message.innerHTML="";

    },3000);

}

function showError(text){

    message.className="message error";

    message.innerHTML="❌ "+text;

    setTimeout(()=>{

        message.className="message";

        message.innerHTML="";

    },3000);

}

/***********************
 * DARK MODE
 ************************/

function initDarkMode(){

    const dark = window.matchMedia("(prefers-color-scheme: dark)");

    applyTheme(dark.matches);

    dark.addEventListener("change",(e)=>{

        applyTheme(e.matches);

    });

}

function applyTheme(isDark){

    if(isDark){

        document.body.classList.add("dark-mode");

    }

    else{

        document.body.classList.remove("dark-mode");

    }

}

/***********************
 * CLEAR FORM
 ************************/

function clearIncome(){

    incomeItem.value="";

    incomeAmount.value="";

    incomeGroup.selectedIndex=0;

    incomeItem.focus();

}

function clearExpense(){

    expenseItem.value="";

    expenseAmount.value="";

    expenseGroup.selectedIndex=0;

    expenseItem.focus();

}

/****************************************************
 * PART 2
 * SAVE TO GOOGLE SHEET
 ****************************************************/

/***********************
 * SAVE INCOME
 ************************/

async function saveIncome(){

    if(!validateIncome()) return;

    if(WEB_APP_URL === ""){

        showError("ยังไม่ได้กำหนด WEB_APP_URL");

        return;

    }

    const data = {

        type: "income",

        date: incomeDate.value,

        item: incomeItem.value.trim(),

        amount: cleanNumber(
            incomeAmount.value
        ),

        group: incomeGroup.value

    };

    await sendData(data, clearIncome);

}

/***********************
 * SAVE EXPENSE
 ************************/

async function saveExpense(){

    if(!validateExpense()) return;

    if(WEB_APP_URL === ""){

        showError("ยังไม่ได้กำหนด WEB_APP_URL");

        return;

    }

    const data = {

        type: "expense",

        date: expenseDate.value,

        item: expenseItem.value.trim(),

        amount: cleanNumber(
            expenseAmount.value
        ),

        group: expenseGroup.value

    };

    await sendData(data, clearExpense);

}

/***********************
 * SEND DATA
 ************************/

async function sendData(data, callback){

    showLoading();

    try{

        await fetch(WEB_APP_URL, {

            method:"POST",

            mode:"no-cors",

            headers:{
                "Content-Type":"text/plain;charset=utf-8"
            },

            body:JSON.stringify(data)

        });


        // no-cors อ่าน response ไม่ได้
        // จึงถือว่าส่งสำเร็จเมื่อ fetch ไม่ error

        showSuccess(
            "บันทึกข้อมูลเรียบร้อยแล้ว"
        );


        callback();


        saveLastRecord(data);


    }


    catch(error){


        console.error(
            "SEND ERROR:",
            error
        );


        showError(
            "ไม่สามารถเชื่อมต่อ Google Sheet ได้"
        );


    }


    finally{

        hideLoading();

    }

}

/***********************
 * SAVE OFFLINE
 ************************/

function saveOffline(data){

    let offline=localStorage.getItem("offlineData");

    if(!offline){

        offline=[];

    }else{

        offline=JSON.parse(offline);

    }

    offline.push({

        ...data,

        saved:new Date().toISOString()

    });

    localStorage.setItem(

        "offlineData",

        JSON.stringify(offline)

    );

}

/***********************
 * SEND OFFLINE
 ************************/

async function syncOffline(){

    let offline=localStorage.getItem("offlineData");

    if(!offline) return;

    offline=JSON.parse(offline);

    if(offline.length===0) return;

    const remain=[];

    for(const item of offline){

        try{

            const response=await fetch(WEB_APP_URL,{

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify(item)

            });

            const result=await response.json();

            if(result.status!=="success"){

                remain.push(item);

            }

        }

        catch(e){

            remain.push(item);

        }

    }

    localStorage.setItem(

        "offlineData",

        JSON.stringify(remain)

    );

}

/***********************
 * LAST RECORD
 ************************/

function saveLastRecord(data){

    localStorage.setItem(

        "lastRecord",

        JSON.stringify({

            ...data,

            datetime:new Date().toLocaleString("th-TH")

        })

    );

}

/***********************
 * LOAD LAST RECORD
 ************************/

function loadLastRecord(){

    const data=localStorage.getItem("lastRecord");

    if(!data) return;

    console.log(

        JSON.parse(data)

    );

}

/***********************
 * INTERNET
 ************************/

window.addEventListener(

    "online",

    ()=>{

        syncOffline();

    }

);

window.addEventListener(

    "load",

    ()=>{

        syncOffline();

        loadLastRecord();

    }

);

/****************************************************
 * PART 3
 * UI ENHANCEMENT
 ****************************************************/


/***********************
 * MONEY FORMAT
 ************************/

function formatCurrency(number){

    return new Intl.NumberFormat(
        "th-TH",
        {
            style:"currency",
            currency:"THB",
            minimumFractionDigits:2
        }

    ).format(number);

}



/***********************
 * DISPLAY THAI DATE
 ************************/

function thaiDate(date){

    const d=new Date(date);

    return d.toLocaleDateString(
        "th-TH",
        {
            year:"numeric",
            month:"long",
            day:"numeric"
        }
    );

}



/***********************
 * SAVE HISTORY
 ************************/

function saveHistory(data){

    let history=
        localStorage.getItem("history");


    if(!history){

        history=[];

    }

    else{

        history=JSON.parse(history);

    }


    history.unshift({

        ...data,

        displayDate:
        thaiDate(data.date),

        amountText:
        formatCurrency(data.amount),

        saveTime:
        new Date()
        .toLocaleString("th-TH")

    });



    // เก็บสูงสุด 10 รายการ

    history=history.slice(0,10);



    localStorage.setItem(

        "history",

        JSON.stringify(history)

    );

}



/***********************
 * LOAD HISTORY
 ************************/

function loadHistory(){

    const history=
        localStorage.getItem("history");


    if(!history){

        return [];

    }


    return JSON.parse(history);

}



/***********************
 * CALCULATE SUMMARY
 ************************/

function calculateSummary(){


    const history=
        loadHistory();


    let income=0;

    let expense=0;



    history.forEach(item=>{


        if(item.type==="income"){

            income+=Number(item.amount);

        }


        if(item.type==="expense"){

            expense+=Number(item.amount);

        }


    });



    return {


        income,

        expense,

        balance:
        income-expense

    };


}



/***********************
 * SHOW SUMMARY
 ************************/

function showSummary(){


    const summary=
        calculateSummary();


    console.log(
        "รายรับ",
        formatCurrency(summary.income)
    );


    console.log(
        "รายจ่าย",
        formatCurrency(summary.expense)
    );


    console.log(
        "คงเหลือ",
        formatCurrency(summary.balance)
    );


}



/***********************
 * TOAST
 ************************/

function toast(text,type="success"){


    let box=
    document.createElement("div");



    box.className=
    "toast "+type;



    box.innerHTML=text;



    document.body.appendChild(box);



    setTimeout(()=>{


        box.classList.add("show");


    },100);



    setTimeout(()=>{


        box.classList.remove("show");


        setTimeout(()=>{

            box.remove();

        },300);


    },3000);


}



/***********************
 * SUCCESS ANIMATION
 ************************/

function successAnimation(){


    document.body.classList.add(
        "success-animation"
    );


    setTimeout(()=>{


        document.body.classList.remove(
            "success-animation"
        );


    },700);


}



/***********************
 * BUTTON DEBOUNCE
 ************************/

function debounce(func,delay=1000){


    let timer;


    return function(){


        clearTimeout(timer);


        timer=setTimeout(()=>{


            func.apply(this,arguments);


        },delay);


    };


}



/***********************
 * NETWORK CHECK
 ************************/

function checkNetwork(){


    if(!navigator.onLine){


        toast(
            "⚠️ ไม่มีอินเทอร์เน็ต ข้อมูลจะถูกเก็บไว้ชั่วคราว",
            "warning"
        );


        return false;

    }


    return true;

}



/***********************
 * UPDATE SAVE FUNCTION
 ************************/

const originalSaveIncome =
saveIncome;


const originalSaveExpense =
saveExpense;



saveIncome =
debounce(
    originalSaveIncome,
    800
);



saveExpense =
debounce(
    originalSaveExpense,
    800
);



/***********************
 * ENHANCED CLEAR
 ************************/

function resetAll(){


    setToday();


    incomeItem.value="";

    incomeAmount.value="";

    incomeGroup.selectedIndex=0;



    expenseItem.value="";

    expenseAmount.value="";

    expenseGroup.selectedIndex=0;



}



/***********************
 * AUTO SAVE HISTORY HOOK
 ************************/

const oldSaveLastRecord =
saveLastRecord;



saveLastRecord=function(data){


    oldSaveLastRecord(data);


    saveHistory(data);


    showSummary();


};



/***********************
 * FORMAT INPUT REAL TIME
 ************************/

function liveNumberFormat(input){

    input.addEventListener("input", function(){

        let raw = this.value;

        // ลบ comma ออกก่อน
        raw = raw.replace(/,/g, "");

        // อนุญาตเฉพาะตัวเลขและจุดทศนิยม
        raw = raw.replace(/[^\d.]/g, "");

        // ให้มีจุดทศนิยมได้เพียง 1 จุด
        const parts = raw.split(".");

        if(parts.length > 2){

            raw = parts[0] + "." + parts.slice(1).join("");

        }

        // ถ้ายังไม่มีตัวเลข ให้ปล่อยว่าง
        if(raw === ""){

            this.value = "";

            return;

        }

        // กรณีผู้ใช้กำลังพิมพ์ เช่น 100.
        // ต้องเก็บจุดไว้ ไม่เช่นนั้นจะพิมพ์ทศนิยมต่อไม่ได้
        if(raw.endsWith(".")){

            const integerPart = raw.slice(0, -1);

            this.value = Number(integerPart).toLocaleString("en-US") + ".";

            return;

        }

        const number = Number(raw);

        if(isNaN(number)){

            this.value = "";

            return;

        }

        // แสดง comma แต่ไม่บังคับทศนิยม
        this.value = number.toLocaleString("en-US", {

            maximumFractionDigits: 2

        });

    });

}



liveNumberFormat(
    incomeAmount
);


liveNumberFormat(
    expenseAmount
);



/***********************
 * REMOVE COMMA BEFORE SEND
 ************************/

function cleanNumber(value){


    return Number(

        String(value)
        .replace(/,/g,"")

    );

}



/***********************
 * SERVICE WORKER READY
 ************************/

if(
"serviceWorker" in navigator
){

    console.log(
        "Ready for PWA"
    );

}