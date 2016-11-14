(function() {
    $('#canvas').attr('width', window.innerWidth);
    $('#canvas').attr('height', window.innerHeight);
    var cnvs = $('#canvas').get(0);
    var ctx = cnvs.getContext('2d');
    var cnvs_buffer = document.createElement('canvas');
    var ctx_buffer = cnvs_buffer.getContext('2d');
    var cw = cnvs.width;
    var ch = cnvs.height;

    var circles = [];

    //Options
    var options = {
        filled: true,
        radiusDelta: .38,
        color: false, 
        bgcolor: 'rnd',
        expAcs: 150,
        expStart: 1.2,
        density: 100,
        denRnd: 700,
        blur: true,
        blurColor: false,
        blurRatio: 15,
        fps: 60,
        lineWidth: false,
        sensitivity: 0.314,
        invertMouse: 1

    }


    //Local vars
    var stopped = false;
    var circCount = 0;
    var fillColor = false;
    var offsetX = 0; 
    var offsetY = 0;

	var getMaxRadius = function() { return cw > ch ? cw / 2  : ch / 2 ; }
    var maxRadius = getMaxRadius();

    function init() {
        hideCursor();
        limitLoop(Render,  options.fps);

    }



    function Render() {

        if (!stopped) {
           
            var deleteCirc = -1;
            // canvas.width = canvas.width;
            ctx.clearRect(0,0,cw,ch);
            fillColor ? ctx.fillStyle = fillColor : false;
            fillColor ? ctx.fillRect(0, 0, cw, ch) : false;


            if (Math.random() * options.denRnd <  options.density) {
                addNewCircle();
            }



            for (i = 0; i < circles.length; i++) {


                circle = circles[i];
               

                if (circle.radius > maxRadius+300) {

                    deleteCirc = i;
                    


                } else {
                	
                    circle.radius = circle.radius + options.radiusDelta * Math.exp(circle.radius /  options.expAcs) +  options.expStart;
                }

                drawCircle(circle.color, circle.background, circle.radius, circle.lineWidth);




            }


            if (deleteCirc !== -1) {
             fillColor = circles[deleteCirc].background;

                circles.splice(deleteCirc, 1);
                console.log(deleteCirc);


            }


        } else {
            return false;
        }


    }

    function addNewCircle() {
        circCount += 1;
        circles.push({
            ID: circCount,
            radius: 0,
            color: options.color ? options.color : getRandomColor(),
            background: options.filled ? ( options.bgcolor == 'rnd' ? getRandomColor() : options.bgcolor) : false,
            lineWidth: options.lineWidth ? options.lineWidth : Math.floor(Math.random() * 4 + 3)
        });

        circles = circles.sort(function(obj1, obj2) {
                return obj1.ID - obj2.ID;
          });
    }

    function drawCircle(stroke, fill, radius, lineWidth) {
        if ( options.blur ) {
            ctx.shadowBlur =  options.blurRatio;
            ctx.shadowColor = ( options.blurColor ?  options.blurColor : stroke);

        }
        
        ctx.strokeStyle = stroke;
        fill ? ctx.fillStyle = fill : ctx.fillStyle = 'transparent';
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(cw / 2 + offsetX, ch / 2 + offsetY, radius, 0, Math.PI * 2, false);
        ctx.closePath();
        fill ? ctx.fill() : null;
        ctx.stroke();
        
    }

    function reset() {
        circles = [];
        canvas.width = canvas.width;
        stopped = false;
        hideCursor();
        $('#panel').addClass('invisible'); 


    }

    function resize() {
        $('#canvas').attr('width', window.innerWidth);
        $('#canvas').attr('height', window.innerHeight);
        cw = cnvs.width;
        ch = cnvs.height;
        cnvs_buffer.width = cw;
        cnvs_buffer.height = ch;
        maxRadius = getMaxRadius();
        reset();
    }

    function togglePlay() {
        if (!stopped) {
            stopped = true;
            showCursor();
            $('#panel').removeClass('invisible');

            console.log(circles);

        } else {
            stopped = false;
            hideCursor();
            $('#panel').addClass('invisible'); 
         

        }
    }

    function hideCursor() {
        $(cnvs).addClass('cursor-none');
    }
  
    function showCursor() { 
        $(cnvs).removeClass('cursor-none');
    }


    var limitLoop = function(fn,  fps) {

        var then = new Date().getTime();

        // custom fps, otherwise fallback to 60
        fps = fps || 60;
        var interval = 1000 / fps;

        return (function loop(time) {

            requestAnimationFrame(loop);


            // again, Date.now() if it's available
            var now = new Date().getTime();
            var delta = now - then;

            if (delta > interval) {
                // Update time
                // now - (delta % interval) is an improvement over just 
                // using then = now, which can end up lowering overall fps
                then = now - (delta % interval);

                // call the fn
                fn();
            }
        }(0));
    }

    //Event handlers

    window.startAnimation = function() {
        stopped = false;

    }

    $(window).on("resize", function() {
        resize();
    });

    $('#canvas').on('click', function(e) {
        e.preventDefault();
        reset();
    });

    $('#canvas').dblclick(function(e) {
        e.preventDefault();
        fillColor = false;
        reset();

    });

    document.oncontextmenu = function() {
        return false;
    };

    $(document).mousedown(function(e) {
        if (e.button == 2) {
            togglePlay();
            
            return false;

        }
        return true;
    });

    $(document).on("keypress", function(e) {

        if (e.which == 32) {
            toggleFullScreen();
            $('#panel').addClass('invisible'); 
        }
    });

    // Mousemove tunnel controller

    $("#canvas").mousemove(function(e) {
        var parentOffset = $(this).offset();
        var relX = e.pageX - parentOffset.left;
        var relY = e.pageY - parentOffset.top;
        offsetX = (cw / 2 - relX) *  options.sensitivity *  options.invertMouse;
        offsetY = (ch / 2 - relY) *  options.sensitivity *  options.invertMouse;
    });

    $('.icon-eye').click(function(e){
        toggleFullScreen();
        $('#panel').addClass('invisible'); 
    });

    window.canvas.getOptions = function() {
        return options;
    }

    window.canvas.setOptions = function (opts) {
        $.extend(options, opts);
    }

    //Init generator
    init();

})();