$(document).ready(function() {

    feather.replace();
    const controls = document.querySelector('.controls');
    const cameraOptions = document.querySelector('.video-options>select');
    const video = document.querySelector('video');
    const canvas = document.querySelector('canvas');
    const screenshotImage = document.getElementsByClassName('screenshot-image')[0];
    var approved_upload=document.getElementsByClassName("btn btn-outline-success approved")[0];
    var rejected_upload=document.getElementsByClassName("btn btn-danger rejected")[0];
    const play = document.getElementsByClassName('btn btn-danger play')[0];
    const buttons = [...controls.querySelectorAll('button')];
    const selector = document.getElementsByClassName('video-options')[0];
    var viewwindow=document.getElementsByClassName("subimage")[0];
    var imgselection=document.getElementById("uploadbutton");
    var beforeimgtxt=document.getElementsByClassName("beforeimg")
    var afterimgtxt=document.getElementsByClassName("afterimg")
    var afterapitxt=document.getElementsByClassName("afterapi")
    var windowvideo = document.getElementsByClassName("display-cover")[0]
    let streamStarted = false;
    let flag=false;


    const [pause,screenshot,reject] = buttons;

    window.mobileAndTabletCheck = function () {
      let check = false;
      (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    };

    var mobilecheck = mobileAndTabletCheck()
    if(mobilecheck==false){
      windowvideo.classList.remove('d-none')
      play.classList.remove('d-none');
      for (var i = 1; i < beforeimgtxt.length; i++) {
        beforeimgtxt[i].classList.remove('d-none')
      }
    }

    const constraints = {
      video: {
        width: {
          min: 500,
          ideal: 1920,
          max: 2560,
        },
        height: {
          min: 500,
          ideal: 1080,
          max: 1440
        },
      }
    };

    cameraOptions.onchange = () => {
        console.log(selector)
      const updatedConstraints = {
        ...constraints,
        deviceId: {
          exact: cameraOptions.value
        }
      };
      if (streamStarted) {
        startStream(updatedConstraints);
      }
    };

    const getCameraSelection = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const options = videoDevices.map(videoDevice => {
          return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
        });
        cameraOptions.innerHTML = options.join('');
      };

    play.onclick = () => {
      if (streamStarted) {
        getCameraSelection()
        video.play();
        play.classList.add('d-none');
        pause.classList.remove('d-none');
        screenshot.classList.add('d-none');
        reject.classList.add('d-none');
        return;
      }
        if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        const updatedConstraints = {
          ...constraints,
          deviceId: {
            exact: cameraOptions
          }
        };
        console.log(cameraOptions)
        startStream(updatedConstraints);
        streamStarted=true
      }
    };

    reject.onclick = () => {
        if (streamStarted) {
            getCameraSelection()
            video.play();
            play.classList.add('d-none');
            pause.classList.remove('d-none');
            screenshot.classList.add('d-none');
            reject.classList.add('d-none');
            return;
        }
        if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
            const updatedConstraints = {
              ...constraints,
              deviceId: {
                exact: cameraOptions
              }
            };
            console.log(cameraOptions)
            startStream(updatedConstraints);
            streamStarted=true
          }
        };

    rejected_upload.onclick = () => {
        viewwindow.classList.add('d-none');
        rejected_upload.classList.add('d-none');
        approved_upload.classList.add('d-none');
        imgselection.classList.remove('d-none');
        for(var i=0;i<beforeimgtxt.length;i++)
        {
            beforeimgtxt[i].classList.remove('d-none')
        }
        for(var i=0;i<afterimgtxt.length;i++)
        {
            afterimgtxt[i].classList.add('d-none')
        }
        for(var i=0;i<afterapitxt.length;i++)
        {
            afterapitxt[i].classList.add('d-none')
        }
    }


    approved_upload.onclick = () => {
      let formData = new FormData();
      formData.append("photo", viewwindow.src);
      console.log(viewwindow)
      console.log(viewwindow.src)
      fetch('static/images/', { method: "POST", body: formData });
        userAction()
    }

    const userAction = async () => {
        // console.log(`https://xrimageapi-agg4nfwosq-uc.a.run.app/analyse_image?imageLink=${viewwindow.src}`)
        const response = await fetch(`https://xrimageapi-agg4nfwosq-uc.a.run.app/analyse_image?imageLink=${viewwindow.src}`);
        const myJson = await response.json(); //extract JSON from the http response
        console.log(myJson)
        for(var i=0;i<afterimgtxt.length;i++)
        {
            afterimgtxt[i].classList.add('d-none')
        }
        for(var i=0;i<afterapitxt.length;i++)
        {
            afterapitxt[i].classList.remove('d-none')
        }
        try{
          afterapitxt[1].innerHTML = `O classificou o Raio-X na categoria ${myJson['Probability']} com probabilidade estimada de ${myJson['Disease']}`
        }catch{
          afterapitxt[1].innerHTML = 'Serviço indisponível'
        }
      }

    const doScreenshot = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        viewwindow.src = canvas.toDataURL('image/webp');
        viewwindow.classList.remove('d-none');
        rejected_upload.classList.remove('d-none');
        approved_upload.classList.remove('d-none');
        imgselection.classList.add('d-none');
        for(var i=0;i<beforeimgtxt.length;i++)
        {
            beforeimgtxt[i].classList.add('d-none')
        }
        for(var i=0;i<afterimgtxt.length;i++)
        {
            afterimgtxt[i].classList.remove('d-none')
        }
        for(var i=0;i<afterapitxt.length;i++)
        {
            afterapitxt[i].classList.add('d-none')
        }
      };

    const pauseStream = () => {

      video.pause();

      reject.classList.remove('d-none')
      screenshot.classList.remove('d-none');
      pause.classList.add('d-none');
    };

    pause.onclick = pauseStream;
    screenshot.onclick = doScreenshot;

    const startStream = async (constraints) => {
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        /* use the stream */
        } catch(err) {
        console.log("Acesso negado")
        }
    handleStream(stream);
    };

    const handleStream = (stream) => {
      video.srcObject = stream;
      play.classList.add('d-none');
      screenshot.classList.add('d-none');
      pause.classList.remove('d-none');
      reject.classList.add('d-none');
      selector.classList.remove('d-none');
      if(flag==false){
          getCameraSelection()
          flag=true
        }
    };

    function changeImage(path) {
        document.getElementById("logo").src = path;
    }

    function colorLinks(hex,links_ref)
    {
    var links = links_ref;
    for(var i=0;i<links.length;i++)
    {
        if(links[i].href)
        {

            links[i].style.color = hex;
        }
    }
    }
    function colorHover(css)
    {
        var style = document.createElement('style');

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.getElementsByTagName('head')[0].appendChild(style);
    }

    $(window).scroll(function() {
      // checks if window is scrolled more than 500px, adds/removes solid class
        linksRef=document.getElementById("navbarToggle").getElementsByClassName('link')
        if($(this).scrollTop() > 500) {
            $('.navbar').addClass('solid');
            changeImage('/static/images/Iteratec_Conceito2.png')
            colorLinks("#ffffff",linksRef)
            var css = "a.active, a:hover{ background:rgb(81, 81, 190) }";
            colorHover(css)
        } else {
            $('.navbar').removeClass('solid');
            changeImage('/static/images/Iteratec_Sob_Arredondado_Curto_sem_background.png')
            colorLinks("#000d4f",linksRef)
            var css = "a.active, a:hover{ background:rgb(100, 254, 189) }";
            colorHover(css)

        }
    });



});
