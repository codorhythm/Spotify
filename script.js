console.log("lets write js")
let currentSong = new Audio();
let songs;

const secondsToMinutesSeconds = (seconds) => {

    if(isNaN(seconds) || seconds<0){
        return "00:00"
    }
    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds with leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Combine minutes and seconds with a colon
    const formattedTime = `${formattedMinutes}:${formattedSeconds}`;

    return formattedTime;
};

// Example usage:
const seconds = 73;
const formattedTime = secondsToMinutesSeconds(seconds);
console.log(formattedTime); // Output: "01:13"



async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    // console.log(response); // returns a table of songs 
    let div = document.createElement("div");
    div.innerHTML = response;
    // let tds = div.getElementsByTagName("td");
    // console.log(tds);//accessing td from table 
    let songs = [];
    let as  = div.getElementsByTagName("a");
    // console.log(as); //trying to access the a href 
    for(let index = 0; index < as.length;  index++){
        const element = as[index];
        if(element.href.endsWith(".m4a")){
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    // console.log(songs); // get songs 
    return songs;

}

const playMusic = (track, pause = false) =>{
    // let audio = new Audio("/songs/" + track);
    currentSong.src= "/songs/" + track;
    // audio.play();   
    if(!pause){
    currentSong.play();
    play.src = "pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function main(){

    
    //getting list of all songs 
    let songs  = await getSongs();
    // console.log(songs)
    playMusic(songs[0], true);

    //listing all the songs in the play list 
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs){
        songUL.innerHTML = songUL.innerHTML + `
         
        <li>
        <img src="music.svg" alt="" srcset="">
        <div class="info">
            <div>${song.replaceAll("%20"," ")}</div>
            <div>Pratulya</div>
        </div>
        <div class="playnow">
            <div>Play Now</div>
            <img class="invert" src="play.svg" alt="" srcset="">
        </div> 
        
         </li>`;
    }
    //play the first song 
    // var audio = new Audio(songs[0]);
    // audio.play();
    // audio.addEventListener("ontimeupdate",() => {
    //     // let duration = audio.duration;
    //     // console.log(duration); //duration coming in seconds 
    //     console.log(audio.duration,audio.currentSrc, audio.currentTime)
    // })


    //attaching event listener to songs 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        // console.log(e)// Seeing whats happening e has all the lis
        // console.log(e.querySelector(".info").firstElementChild.innerHTML);//since lis have info and the first element child is name of the song 

        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })


    // Attach event listener to next play and previous
    play.addEventListener("click", () => {
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg";
        }else{
            currentSong.pause();
            play.src = "play.svg"
        }
    })


    //for time update event 
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration) * 100 + "%"
    })


    //add an event listener to seekbar 
    document.querySelector(".seekbar").addEventListener("click", e=>{
        // console.log(e.target.getBoundingClientRect(),e.offsetX)
        console.log(e.target.getBoundingClientRect().width,e.offsetX);
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) *100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent)/100
    })

    // event listener for hamburger

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
    })

    // event listener for close
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-110%"
    })

    // add an event listener for prve and next
    previous.addEventListener("click", ()=>{
        currentSong.pause();
        console.log("prev clicked")
        console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        console.log(index);
        if((index-1) >= 0){
           
            playMusic(songs[index-1])
        } else{
            playMusic(songs[songs.length-1]);
        }

        
        

    })
    next.addEventListener("click", ()=>{
        currentSong.pause();
        console.log("next clicked")
        console.log(currentSong);

        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        console.log(index);
        if((index+1) < songs.length){
            playMusic(songs[index+1]);
        } else{
            playMusic(songs[0])
        }
        
    })
}

main();
