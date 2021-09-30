//获取dom节点
const container=document.querySelector('.container');
const seats=document.querySelectorAll('.row .seat:not(.occupied)');
const count=document.getElementById('count');
const total=document.getElementById('total');
const movieSelect=document.getElementById('movie');
//movieSelect.value是字符串类型  使用+号将其转换成整数
let ticketPrice=+movieSelect.value;
function setMovieData(movieIndex,moviePrice){
    localStorage.setItem('selectedMovieIndex',movieIndex);
    localStorage.setItem('selectedMoviePrice',moviePrice);
}
//更新localStroge
function updateSelectedCount(){
    const selectedSeats=document.querySelectorAll('.row .seat.selected');
    const seatsIndex=[...selectedSeats].map(seat=>{
        [...seats].indexOf(seat);
    });
    localStorage.setItem('selectedSeats',JSON.stringify(seatsIndex));
    const selectedSeatsCount=selectedSeats.length;
    count.innerHTML=selectedSeatsCount;
    total.innerHTML=selectedSeatsCount*ticketPrice;
    setMovieData(movieSelect.index,movieSelect.value);
}
function populateUI(){
    const selectedSeats=JSON.parse(localStorage.getItem('selectedSeats'));
    if(selectedSeats!==null&&selectedSeats.length>0){
        seats.forEach((seat,index)=>{
            if(selectedSeats.indexOf(index)>-1){
                seat.classList.add('selected');
            }
        })
    }
    const selectedMovieIndex=localStorage.getItem('selectedMovieIndex');
    if(selectedMovieIndex!==null){
        movieSelect.index=selectedMovieIndex;
    }
}
movieSelect.addEventListener('change',e=>{
    ticketPrice=+e.target.value;
    setMovieData(e.target.index,e.target.value);
    updateSelectedCount();
})

container.addEventListener('click',e=>{
    if(e.target.classList.contains('seat')&&!e.target.classList.contains('occupied')){
        e.target.classList.toggle('selected');
    }
    updateSelectedCount();
})
updateSelectedCount();
populateUI();
