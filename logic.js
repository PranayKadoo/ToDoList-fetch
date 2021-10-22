//code for edit operation
// let flag;
// let flag_current_task;
//***************************************************************************/
let do_list = document.querySelector(".do_list");
let new_task;
let new_task_arr = [];
let isempty_list = [];
let done_task = [];
let c_task,c_task_status;
let id_count=1;
let pic_hide1 = document.querySelector('.nothing_pic1');
let pic_hide2 = document.querySelector('.nothing_pic2');
pic_hide1.style.display = 'block';
pic_hide2.style.display = 'block';
document.getElementById("in_text")
.addEventListener("keyup",(event)=>{
    event.preventDefault();
    if (event.keyCode===13){
        document.getElementById("in_btn").click();
    }
});
function data_entry(){
    new_task = document.getElementById("in_text").value;
    new_task_arr.push(new_task);
    isempty_list.push(new_task);
    console.log(isempty_list.length)
    if(isempty_list.length!==0){
    pic_hide1.style.display = 'none';
    }
    //post data to json placeholder
    fetch('https://jsonplaceholder.typicode.com/posts',{
        method:'POST',
        body:JSON.stringify({
            task:new_task,
        }),
        headers:{
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(function(response){
        return response.json()
    })
    .then(function(data){
      console.log(data)
    })
    //****put data to the api********************************************//
    fetch(`https://jsonplaceholder.typicode.com/posts/${id_count}`,{
        method:'PUT',
        body:JSON.stringify({
            task:new_task,
            id:id_count
        }),
        headers:{
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response)=>{
        return response.json()
    })
    .then((data)=>{
        console.log(data)
    })

     //invokeing method with new task
     let task = new Task();
     task.createTaskDom(new_task);
}

class Task{

    operateTaskDom(task_dom){
        task_dom.forEach((task)=>{
        let task_temp = task.innerText;
        let task_name_edit1 = task_temp.replace('✔','');
        let task_name_edit2 = task_name_edit1.replace('✘','');
        let task_name_edit3 = task_name_edit2.replace('✍','');
        let temp_count = task.querySelector(".id").innerText;
            let task_name_edit4 = task_name_edit3.replace(`${temp_count}`,'');
            let task_name_final = task_name_edit4.trim();
       // let task_name_edit4 = task_name_edit3.replace(`${id_count}`,'');
        //console.log("here"+ id_count);
        //let task_name_final = task_name_edit4.trim();
        let task_name_node = task.parentNode;

        //*****removing the current task from browser page*******//
        task.querySelector(".btn_remove")
        .addEventListener("click",()=>{
           let temp_count = task.querySelector(".id").innerText;
           let task_name_edit4 = task_name_edit3.replace(`${temp_count}`,'');
           let task_name_final = task_name_edit4.trim();
           console.log("before slice:  "+isempty_list.length);
           for(let i=0;i<isempty_list.length;i++){
               if(isempty_list[i]==task_name_final){
                   isempty_list.splice(i,1);
               }
           }
           if(isempty_list.length===0){
            pic_hide1.style.display = 'block';
           }
        //deleting current task from api
            fetch(`https://jsonplaceholder.typicode.com/posts/${temp_count}`,{
                method:'delete',
            })
            .then((response)=>{return response.json()})
            .then((data)=>{console.log(data)});
        //*********************************************/

        //removing current task dynamically
            task.remove();
            //*********************************************/ 

            //try to show the list of all task objects from our fake api
            // fetch('https://jsonplaceholder.typicode.com/posts')
            // .then(function(response){
            // return response.json()
            // })
            // .then(function(data){
            // console.log("after  ..  "+data)
            // }) 
            //**********************************************/

        });
        //**************************************************************************/
        //***done button(btn_done) invoked to mark done the belonging current task*/
        task.querySelector(".btn_done")
        .addEventListener("click",()=>{
                pic_hide2.style.display = 'none';
                let temp_count = task.querySelector(".id").innerText;
                let task_name_edit4 = task_name_edit3.replace(`${temp_count}`,'');
                let task_name_final = task_name_edit4.trim();
                let task_name_dom = task_name_node.querySelectorAll(".task_name");
     
          for(let value of task_name_dom){
            if(value.innerText==task_name_final && !done_task.includes(value.innerText)){
                 value.style.textDecoration = 'line-through';
                 value.style.textDecorationColor = 'red';
                 task.querySelector('.btn_done').style.textDecoration = 'line-through';
                 task.querySelector('.btn_done').style.textDecorationColor = 'red';
                 done_task.push(value.innerText);

      //******patching done data to our old data to fake api for the task that has been done
                 fetch(`https://jsonplaceholder.typicode.com/posts/${temp_count}`, {
                 method: 'PUT',
                 body: JSON.stringify({
                 task:new_task_arr[temp_count-1],
                 status:"Done"
                 }),
                 headers: {
                 'Content-type': 'application/json; charset=UTF-8',
                 },
                })
                .then((response) =>
                 response.json()
                )
                .then((data) => {
                 c_task=data.task;
                 c_task_status=data.status
                });
        //***dynamically getting data from api and added to the browser page*/
            function history_list(){
                let temp_div =  document.querySelector('.history_list');
                let div = document.createElement('div');
                div.className = 'history_data_in';
                div.innerHTML = `<h3>Task Name: ${c_task},  Status:${c_task_status}</h3>`
                temp_div.appendChild(div); 
            }
            setTimeout(history_list,1000);   
          }
         }
        })
      
        //**edit the perticular task */
        task.querySelector('.btn_edit')
        .addEventListener('click',()=>{
             document.getElementById("in_text").value = task_name_final;
             //*********************************************/

             //removing current task dynamically
             task.remove();
            
            //*********************************************/ 
            //code for edit operation
            // flag = true;
            // flag_current_task = task_name_final;
        })
    })
  }

  createTaskDom(addTask){
    if(addTask!=""  && !done_task.includes(addTask)){
   do_list.insertAdjacentHTML("beforeend",`
   <div class="do_list_in">
   <h4 class="task_name">${addTask}</h4>
   <button class="btn_done">&#x2714;</button>
   <button class="btn_remove"> &#x2718;</button>
   <button class="btn_edit"> &#x270D;</button>
   <h6 class="id"> ${id_count}</h6>
   </div> 
   `)
    }else{

    }
 
   document.getElementById("in_text").value = '';
   const task_dom = do_list.querySelectorAll(".do_list_in");
   id_count++;
   this.operateTaskDom(task_dom);
 }  
}