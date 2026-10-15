// =========================
// BUKA UNDANGAN
// =========================

function openInvitation(){

    document.querySelector(".cover").style.display="none";

    document.getElementById("content").style.display="block";

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}





// =========================
// COUNTDOWN
// =========================


const weddingDate = new Date(
    "January 31, 2027 10:00:00"
).getTime();



setInterval(function(){


const now = new Date().getTime();


const distance = weddingDate - now;



const days = Math.floor(
distance / (1000*60*60*24)
);



const hours = Math.floor(
(distance % (1000*60*60*24)) /
(1000*60*60)
);



const minutes = Math.floor(
(distance % (1000*60*60)) /
(1000*60)
);



cons… Baca selengkapnya
14.10
Hari Ini
14.34
14.58
Baik. Karena desain kita berubah mengikuti referensi video (lebih botanical invitation, bukan card modern), maka script.js juga saya revisi agar mendukung:

Cover seperti halaman undangan
Tombol buka undangan dengan efek transisi
Scroll reveal animasi setiap section
Countdown
Copy rekening
RSVP Google Apps Script
Efek bunga muncul perlahan

Ganti seluruh isi script.js lama dengan ini:

// =================================
// FIKRI & SYIFA WEDDING WEBSITE
// Botanical Minimalist Version
// =================================



// ================================
// OPEN INVITATION
// ================================

function openInvitation(){

    const cover = document.querySelector(".cover");
    const content = document.getElementById("content");


    cover.classList.add("hide-cover");


    setTimeout(()=>{

        cover.style.display="none";

        content.style.display="block";


        window.scrollTo({
            top:0,
            behavior:"smooth"
        });


    },1200);


}





// ================================
// COUNTDOWN WEDDING
// ================================


const weddingDate = new Date(
"January 31, 2027 10:00:00"
).getTime();



function updateCountdown(){


    const now = new Date().getTime();


    const distance =
    weddingDate - now;



    if(distance < 0){

        document.querySelector(".timer")
        .innerHTML =
        "Hari Bahagia Telah Tiba";

        return;

    }



    const days =
    Math.floor(
    distance /
    (1000*60*60*24)
    );


    const hours =
    Math.floor(
    (distance %
    (1000*60*60*24)) /
    (1000*60*60)
    );


    const minutes =
    Math.floor(
    (distance %
    (1000*60*60)) /
    (1000*60)
    );


    const seconds =
    Math.floor(
    (distance %
    (1000*60)) /
    1000
    );



    document.getElementById("days")
    .innerHTML = days;


    document.getElementById("hours")
    .innerHTML = hours;


    document.getElementById("minutes")
    .innerHTML = minutes;


    document.getElementById("seconds")
    .innerHTML = seconds;


}


setInterval(updateCountdown,1000);

updateCountdown();







// ================================
// SCROLL ANIMATION
// ================================


const sections =
document.querySelectorAll("section");



const observer =
new IntersectionObserver(

(entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


entry.target.classList.add(
"show"
);


}


});


},

{
threshold:0.15
}


);



sections.forEach(section=>{

observer.observe(section);

});








// ================================
// COPY REKENING
// ================================


function copyRekening(){


const rekening =
"XXXX XXXX XXXX";



navigator.clipboard
.writeText(rekening);



alert(
"Nomor rekening berhasil disalin"
);


}







// ================================
// RSVP GOOGLE SHEET
// ================================


const form =
document.getElementById(
"rsvpForm"
);



if(form){


form.addEventListener(
"submit",
(e)=>{


e.preventDefault();



const data = {


nama:
document.getElementById(
"nama"
).value,


jumlah:
document.getElementById(
"jumlah"
).value,


status:
document.getElementById(
"status"
).value,


pesan:
document.getElementById(
"pesan"
).value,


tanggal:
new Date()
.toLocaleString(
"id-ID"
)


};





fetch(

"MASUKKAN_URL_APPS_SCRIPT",

{


method:"POST",

mode:"no-cors",


headers:{


"Content-Type":
"application/json"

},


body:
JSON.stringify(data)


}


)



.then(()=>{


alert(
"Terima kasih atas konfirmasi Anda 🤍"
);



form.reset();



})



.catch(()=>{


alert(
"Gagal mengirim data"
);


});



});


}








// ================================
// SMOOTH SCROLL
// ================================


document
.querySelectorAll(
'a[href^="#"]'
)
.forEach(anchor=>{


anchor.addEventListener(
"click",
function(e){


e.preventDefault();



document
.querySelector(
this.getAttribute("href")
)
.scrollIntoView({

behavior:"smooth"

});


});


});
