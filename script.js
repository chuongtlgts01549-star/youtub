const upload = document.getElementById("upload")
const videosDiv = document.getElementById("videos")
const sidebarDiv = document.getElementById("sidebarVideos")
const player = document.getElementById("mainPlayer")
const commentsDiv = document.getElementById("comments")
const commentInput = document.getElementById("commentInput")
const addCommentBtn = document.getElementById("addComment")
const search = document.getElementById("search")

let videoList=[]
let activeVideo=null
let comments=[]

// Upload video
upload.onchange=function(){
  const files=this.files
  for(let file of files){
    const url = URL.createObjectURL(file)
    videoList.push({
      name:file.name,
      url:url,
      views:Math.floor(Math.random()*1000),
      likes:0,
      dislikes:0
    })
  }
  renderVideos()
}

// Render main feed
function renderVideos(){
  videosDiv.innerHTML=""
  sidebarDiv.innerHTML=""
  for(let v of videoList){
    const box=document.createElement("div")
    box.className="videoBox"

    const thumb=document.createElement("video")
    thumb.src=v.url
    thumb.muted=true
    thumb.onmouseover=()=>thumb.play()
    thumb.onmouseout=()=>{thumb.pause();thumb.currentTime=0}
    thumb.onclick=()=>{
      player.src=v.url
      player.play()
      activeVideo=v
      renderComments()
    }

    const title=document.createElement("p")
    title.innerText=v.name

    const view=document.createElement("p")
    view.innerText="Views: "+v.views

    setInterval(()=>{
      v.views++
      view.innerText="Views: "+v.views
    },4000)

    const like=document.createElement("button")
    like.innerText="👍 "+v.likes
    like.onclick=function(){v.likes++;like.innerText="👍 "+v.likes}

    const dislike=document.createElement("button")
    dislike.innerText="👎 "+v.dislikes
    dislike.onclick=function(){v.dislikes++;dislike.innerText="👎 "+v.dislikes}

    box.appendChild(thumb)
    box.appendChild(title)
    box.appendChild(view)
    box.appendChild(like)
    box.appendChild(dislike)
    videosDiv.appendChild(box)

    // Sidebar
    const sideBox=document.createElement("div")
    sideBox.className="videoBox"
    sideBox.innerText=v.name
    sideBox.onclick=()=>{
      player.src=v.url
      player.play()
      activeVideo=v
      renderComments()
    }
    sidebarDiv.appendChild(sideBox)
  }
}

// Comments
function renderComments(){
  commentsDiv.innerHTML=""
  if(!activeVideo) return
  comments.filter(c=>c.video==activeVideo.name).forEach(c=>{
    const p=document.createElement("p")
    p.innerText=c.text
    commentsDiv.appendChild(p)
  })
}

addCommentBtn.onclick=()=>{
  if(activeVideo && commentInput.value.trim()!=""){
    comments.push({video:activeVideo.name,text:commentInput.value})
    commentInput.value=""
    renderComments()
  }
}

// Search
search.oninput=function(){
  const text=search.value.toLowerCase()
  videosDiv.innerHTML=""
  sidebarDiv.innerHTML=""
  for(let v of videoList){
    if(v.name.toLowerCase().includes(text)){
      const box=document.createElement("div")
      box.className="videoBox"
      const thumb=document.createElement("video")
      thumb.src=v.url
      thumb.muted=true
      thumb.onclick=()=>{player.src=v.url;player.play();activeVideo=v;renderComments()}
      const title=document.createElement("p")
      title.innerText=v.name
      box.appendChild(thumb)
      box.appendChild(title)
      videosDiv.appendChild(box)
      const sideBox=document.createElement("div")
      sideBox.className="videoBox"
      sideBox.innerText=v.name
      sideBox.onclick=()=>{player.src=v.url;player.play();activeVideo=v;renderComments()}
      sidebarDiv.appendChild(sideBox)
    }
  }
}

// Auto refresh feed every 2 minutes
setInterval(()=>{
  videoList=[]
  videosDiv.innerHTML=""
  sidebarDiv.innerHTML=""
},120000)
