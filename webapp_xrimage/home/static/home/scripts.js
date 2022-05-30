$(document).ready(function() {
    // Transition effect for navbar 
    
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