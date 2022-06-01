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
    let streamStarted = false;
    let flag=false;


    const [pause,screenshot,reject] = buttons;

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
        userAction()
    }

    const userAction = async () => {
        const response = await fetch(`https://meuservico-agg4nfwosq-uc.a.run.app/analyse_image?imageLink=${viewwindow.src}`);
        console.log(`https://meuservico-agg4nfwosq-uc.a.run.app/analyse_image?imageLink=${viewwindow.src}`)
        console.log("testeeee")
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
          changeImage('https://firebasestorage.googleapis.com/v0/b/xrimage-ia.appspot.com/o/Iteratec_Conceito2.png?alt=media&token=58a295b2-fb30-43db-a697-5f7e418516e6')
            colorLinks("#ffffff",linksRef)
            var css = "a.active, a:hover{ background:rgb(81, 81, 190) }";
            colorHover(css)
        } else {
            $('.navbar').removeClass('solid');
          changeImage('https://firebasestorage.googleapis.com/v0/b/xrimage-ia.appspot.com/o/Iteratec_Sob_Arredondado_Curto_sem_background.png?alt=media&token=06450745-2a51-4ee6-be77-c6afe264c5ea')
            colorLinks("#000d4f",linksRef)
            var css = "a.active, a:hover{ background:rgb(100, 254, 189) }";
            colorHover(css)

        }
    });



});
