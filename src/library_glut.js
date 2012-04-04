
var LibraryGLUT = {
  $GLUT: {
    initTime: null,
    displayFunc: null,
    keyboardFunc: null,
    keyboardUpFunc: null,
    specialFunc: null,
    specialUpFunc: null,
    reshapeFunc: null,
    motionFunc: null,
    passiveMotionFunc: null,
    mouseFunc: null,
    lastX: 0,
    lastY: 0,
    buttons: 0,
    modifiers: 0,

    saveModifiers__deps: ['$GLUT'],
    saveModifiers: function(event) {
      GLUT.modifiers = 0;
      if (event['shiftKey'])
        GLUT.modifiers += 1; /* GLUT_ACTIVE_SHIFT */
      if (event['ctrlKey'])
        GLUT.modifiers += 2; /* GLUT_ACTIVE_CTRL */
      if (event['altKey'])
        GLUT.modifiers += 4; /* GLUT_ACTIVE_ALT */
    },

    onMousemove__deps: ['$GLUT'],
    onMousemove: function(event) {
      GLUT.lastX = event['clientX'];
      GLUT.lastY = event['clientY'];
      if (GLUT.buttons == 0 && GLUT.passiveMotionFunc) {
        event.preventDefault();
        GLUT.saveModifiers(event);
        FUNCTION_TABLE[GLUT.passiveMotionFunc](GLUT.lastX, GLUT.lastY);
      } else if (GLUT.buttons != 0 && GLUT.motionFunc) {
        event.preventDefault();
        GLUT.saveModifiers(event);
        FUNCTION_TABLE[GLUT.motionFunc](GLUT.lastX, GLUT.lastY);
      }
    },

    getSpecialKey: function(keycode) {
        var key = null;
        switch (keycode) {
          case 0x70 /*DOM_VK_F1*/: key = 1 /* GLUT_KEY_F1 */; break;
          case 0x71 /*DOM_VK_F2*/: key = 2 /* GLUT_KEY_F2 */; break;
          case 0x72 /*DOM_VK_F3*/: key = 3 /* GLUT_KEY_F3 */; break;
          case 0x73 /*DOM_VK_F4*/: key = 4 /* GLUT_KEY_F4 */; break;
          case 0x74 /*DOM_VK_F5*/: key = 5 /* GLUT_KEY_F5 */; break;
          case 0x75 /*DOM_VK_F6*/: key = 6 /* GLUT_KEY_F6 */; break;
          case 0x76 /*DOM_VK_F7*/: key = 7 /* GLUT_KEY_F7 */; break;
          case 0x77 /*DOM_VK_F8*/: key = 8 /* GLUT_KEY_F8 */; break;
          case 0x78 /*DOM_VK_F9*/: key = 9 /* GLUT_KEY_F9 */; break;
          case 0x79 /*DOM_VK_F10*/: key = 10 /* GLUT_KEY_F10 */; break;
          case 0x7a /*DOM_VK_F11*/: key = 11 /* GLUT_KEY_F11 */; break;
          case 0x7b /*DOM_VK_F12*/: key = 12 /* GLUT_KEY_F12 */; break;
          case 0x25 /*DOM_VK_LEFT*/: key = 100 /* GLUT_KEY_LEFT */; break;
          case 0x26 /*DOM_VK_UP*/: key = 101 /* GLUT_KEY_UP */; break;
          case 0x27 /*DOM_VK_RIGHT*/: key = 102 /* GLUT_KEY_RIGHT */; break;
          case 0x28 /*DOM_VK_DOWN*/: key = 103 /* GLUT_KEY_DOWN */; break;
          case 0x21 /*DOM_VK_PAGE_UP*/: key = 104 /* GLUT_KEY_PAGE_UP */; break;
          case 0x22 /*DOM_VK_PAGE_DOWN*/: key = 105 /* GLUT_KEY_PAGE_DOWN */; break;
          case 0x24 /*DOM_VK_HOME*/: key = 106 /* GLUT_KEY_HOME */; break;
          case 0x23 /*DOM_VK_END*/: key = 107 /* GLUT_KEY_END */; break;
          case 0x2d /*DOM_VK_INSERT*/: key = 108 /* GLUT_KEY_INSERT */; break;
        };
        return key;
    },

    getASCIIKey: function(keycode) {
      // TODO apply modifiers, etc
      return keycode;
    },

    onKeydown__deps: ['$GLUT'],
    onKeydown: function(event) {
      if (GLUT.specialFunc || GLUT.keyboardFunc) {
        var key = GLUT.getSpecialKey(event['keyCode']);
        if (key !== null) {
          if( GLUT.specialFunc ) {
            event.preventDefault();
            GLUT.saveModifiers(event);
            FUNCTION_TABLE[GLUT.specialFunc](key, GLUT.lastX, GLUT.lastY);
          }
        }
        else
        {
          key = GLUT.getASCIIKey(event['keyCode']);
          if( key !== null && GLUT.keyboardFunc ) {
            event.preventDefault();
            GLUT.saveModifiers(event);
            FUNCTION_TABLE[GLUT.keyboardFunc](event['keyCode'], GLUT.lastX, GLUT.lastY);
          }
        }
      }
    },

    onKeyup__deps: ['$GLUT'],
    onKeyup: function(event) {
      if (GLUT.specialUpFunc || GLUT.keyboardUpFunc) {
        var key = GLUT.getSpecialKey(event['keyCode']);
        if (key !== null) {
          if(GLUT.specialUpFunc) {
            event.preventDefault ();
            GLUT.saveModifiers(event);
            FUNCTION_TABLE[GLUT.specialUpFunc](key, GLUT.lastX, GLUT.lastY);
          }
        }
        else
        {
          key = GLUT.getASCIIKey(event['keyCode']);
          if( key !== null && GLUT.keyboardUpFunc ) {
            event.preventDefault ();
            GLUT.saveModifiers(event);
            FUNCTION_TABLE[GLUT.keyboardUpFunc](event['keyCode'], GLUT.lastX, GLUT.lastY);
          }
        }
      }
    },

    onMouseButtonDown__deps: ['$GLUT'],
    onMouseButtonDown: function(event){
      GLUT.lastX = event['clientX'];
      GLUT.lastY = event['clientY'];
      GLUT.buttons |= (1 << event['button']);

      if(GLUT.mouseFunc){
        event.preventDefault();
        GLUT.saveModifiers(event);
        FUNCTION_TABLE[GLUT.mouseFunc](event['button'], 0/*GLUT_DOWN*/, GLUT.lastX, GLUT.lastY);
      }
    },

    onMouseButtonUp__deps: ['$GLUT'],
    onMouseButtonUp: function(event){
      GLUT.lastX = event['clientX'];
      GLUT.lastY = event['clientY'];
      GLUT.buttons &= ~(1 << event['button']);

      if(GLUT.mouseFunc) {
        event.preventDefault();
        GLUT.saveModifiers(event);
        FUNCTION_TABLE[GLUT.mouseFunc](event['button'], 1/*GLUT_UP*/, GLUT.lastX, GLUT.lastY);
      }
    },
  },

  glutGetModifiers__deps: ['$GLUT'],
  glutGetModifiers: function() { return GLUT.modifiers; },

  glutInit__deps: ['$GLUT'],
  glutInit: function(argcp, argv) {
    // Ignore arguments
    GLUT.initTime = Date.now();
    window.addEventListener("keydown", GLUT.onKeydown, true);
    window.addEventListener("keyup", GLUT.onKeyup, true);
    window.addEventListener("mousemove", GLUT.onMousemove, true);
    window.addEventListener("mousedown", GLUT.onMouseButtonDown, true);
    window.addEventListener("mouseup", GLUT.onMouseButtonUp, true);
  },

  glutInitWindowSize: function(width, height) {
    Module['canvas'].width = width;
    Module['canvas'].height = height;
  },

  glutGet__deps: ['$GLUT'],
  glutGet: function(type) {
    switch (type) {
      case 700: /* GLUT_ELAPSED_TIME */
        var now = Date.now();
        return now - GLUT.initTime;
      default:
        throw "glutGet(" + type + ") not implemented yet";
    }
  },

  glutIdleFunc: function(func) {
    window.setTimeout(FUNCTION_TABLE[func], 0);
  },

  glutTimerFunc: function(msec, func, value) {
    window.setTimeout(function() { FUNCTION_TABLE[func](value); }, msec);
  },

  glutDisplayFunc__deps: ['$GLUT'],
  glutDisplayFunc: function(func) {
    GLUT.displayFunc = func;
  },

  glutKeyboardFunc__deps: ['$GLUT'],
  glutKeyboardFunc: function(func) {
    GLUT.keyboardFunc = func;
  },

  glutKeyboardUpFunc__deps: ['$GLUT'],
  glutKeyboardUpFunc: function(func) {
    GLUT.keyboardUpFunc = func;
  },

  glutSpecialFunc__deps: ['$GLUT'],
  glutSpecialFunc: function(func) {
    GLUT.specialFunc = func;
  },

  glutSpecialUpFunc__deps: ['$GLUT'],
  glutSpecialUpFunc: function(func) {
    GLUT.specialUpFunc = func;
  },

  glutReshapeFunc__deps: ['$GLUT'],
  glutReshapeFunc: function(func) {
    GLUT.reshapeFunc = func;
  },

  glutMotionFunc__deps: ['$GLUT'],
  glutMotionFunc: function(func) {
    GLUT.motionFunc = func;
  },

  glutPassiveMotionFunc__deps: ['$GLUT'],
  glutPassiveMotionFunc: function(func) {
    GLUT.passiveMotionFunc = func;
  },

  glutMouseFunc__deps: ['$GLUT'],
  glutMouseFunc: function(func) {
    GLUT.mouseFunc = func;
  },

  glutCreateWindow: function(name) {
#if USE_TYPED_ARRAYS
    try {
      var ctx = Module.canvas.getContext('experimental-webgl');
      if (!ctx) throw 'Could not create canvas :(';
#if GL_DEBUG
      var wrapper = {};
      wrapper.objectMap = new WeakMap();
      wrapper.objectCounter = 1;
      for (var prop in ctx) {
        (function(prop) {
          switch (typeof ctx[prop]) {
            case 'function': {
              wrapper[prop] = function() {
                var printArgs = Array.prototype.slice.call(arguments).map(function(arg) {
                  if (wrapper.objectMap[arg]) return '<' + arg + '|' + wrapper.objectMap[arg] + '>';
                  if (arg.subarray) return '{' + arg + '|' + arg.length /*+ '|' + Array.prototype.slice.call(arg).toString().replace(/,/g, ', ')*/ + '}';
                  return arg;
                });
                Module.printErr('[gl_f:' + prop + ':' + printArgs + ']');
                var ret = ctx[prop].apply(ctx, arguments);
                var printRet = ret;
                if (typeof ret == 'object') {
                  wrapper.objectMap[ret] = wrapper.objectCounter++;
                  printRet = '<' + ret + '|' + wrapper.objectMap[ret] + '>';
                }
                Module.printErr('[     gl:' + prop + ':return:' + printRet + ']');
                return ret;
              }
              break;
            }
            case 'number': case 'string': {
              wrapper.__defineGetter__(prop, function() {
                //Module.printErr('[gl_g:' + prop + ':' + ctx[prop] + ']');
                return ctx[prop];
              });
              wrapper.__defineSetter__(prop, function(value) {
                Module.printErr('[gl_s:' + prop + ':' + value + ']');
                ctx[prop] = value;
              });
              break;
            }
          }
        })(prop);
      }
      Module.ctx = wrapper;
#else
      Module.ctx = ctx;
#endif
      // Set the background of the canvas to black, because glut gives us a
      // window which has a black background by default.
      Module.canvas.style.backgroundColor = "black";
    } catch (e) {
      Module.print('(canvas not available)');
    }
#else
    Module.print('(USE_TYPED_ARRAYS needs to be enabled for WebGL)');
#endif
  },

  glutInitDisplayMode: function(mode) {},
  glutSwapBuffers: function() {},

  glutPostRedisplay__deps: ['$GLUT'],
  glutPostRedisplay: function() {
    if (GLUT.displayFunc) {
      var RAF = window['setTimeout'];
      if (window['requestAnimationFrame']) {
        RAF = window['requestAnimationFrame'];
      } else if (window['mozRequestAnimationFrame']) {
        RAF = window['mozRequestAnimationFrame'];
      } else if (window['webkitRequestAnimationFrame']) {
        RAF = window['webkitRequestAnimationFrame'];
      } else if (window['msRequestAnimationFrame']) {
        RAF = window['msRequestAnimationFrame'];
      }
      RAF.apply(window, [FUNCTION_TABLE[GLUT.displayFunc]]);
    }
  },

  glutMainLoop__deps: ['$GLUT', 'exit', 'glutPostRedisplay'],
  glutMainLoop: function() {
    if (GLUT.reshapeFunc) {
      FUNCTION_TABLE[GLUT.reshapeFunc](Module['canvas'].width,
                                       Module['canvas'].height);
    }
    _glutPostRedisplay();
    _exit(0); // GLUT mainloop should never return
  },

};

mergeInto(LibraryManager.library, LibraryGLUT);
