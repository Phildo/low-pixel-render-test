var GLMan = function (width, height)
{
  //Init html element
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width',width);
  canvas.setAttribute('height',height);
  canvas.style.border = '1px solid black';
  canvas.innerHTML = 'Your browser can\'t handle stuff this cool...';
  this.canvas = canvas;

  //Init gl obj
  //var gl = canvas.getContext('experimental-webgl',{antialias:false});
  var gl = canvas.getContext('experimental-webgl');
  gl.enable(gl.DEPTH_TEST);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  this.gl = gl;

  this.lowResDim = { "width":64, "height":32 };
  //this.lowResDim = { "width":width, "height":height };
  this.highResDim = { "width":width, "height":height };

  this.geoProgram = null;
  this.hrtProgram = null;
  this.lrtProgram = null;
  this.hudProgram = null;

  this.setProgram = function(program, vs, fs)
  {
    switch(program)
    {
      case "geo":
        this.geoProgram = new GeoGLProgram(gl,vs,fs);
        break;
      case "hrt":
        this.hrtProgram = new HighResTexGLProgram(gl,vs,fs);
        break;
      case "lrt":
        this.lrtProgram = new LowResTexGLProgram(gl,vs,fs);
        break;
      case "hud":
        this.hudProgram = new HudGLProgram(gl,vs,fs);
        break;
    }
  }

  this.draw = function()
  {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.lrtProgram.frameBuffer);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.geoProgram.draw();

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.hrtProgram.frameBuffer);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.lrtProgram.draw();

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.hrtProgram.draw();

    gl.clear(gl.DEPTH_BUFFER_BIT); //JUST DEPTH!
    gl.enable(gl.BLEND);
    this.hudProgram.draw();
    gl.disable(gl.BLEND);
  }
}
