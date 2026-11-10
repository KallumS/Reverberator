{
 "patcher": {
  "fileversion": 1,
  "appversion": {
   "major": 9,
   "minor": 0,
   "revision": 0,
   "architecture": "x64",
   "modernui": 1
  },
  "classnamespace": "box",
  "rect": [
   100.0,
   100.0,
   960.0,
   560.0
  ],
  "openinpresentation": 1,
  "default_fontsize": 10.0,
  "default_fontface": 0,
  "default_fontname": "Arial",
  "gridonopen": 1,
  "gridsize": [
   8.0,
   8.0
  ],
  "gridsnaponopen": 1,
  "objectsnaponopen": 1,
  "statusbarvisible": 2,
  "toolbarvisible": 1,
  "boxes": [
   {
    "box": {
     "id": "obj-1",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 1,
     "patching_rect": [
      20.0,
      20.0,
      50.0,
      22.0
     ],
     "outlettype": [
      "int"
     ],
     "text": "midiin"
    }
   },
   {
    "box": {
     "id": "obj-2",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 3,
     "patching_rect": [
      120.0,
      20.0,
      90.0,
      22.0
     ],
     "outlettype": [
      "bang",
      "int",
      "int"
     ],
     "text": "live.thisdevice"
    }
   },
   {
    "box": {
     "id": "obj-3",
     "maxclass": "newobj",
     "numinlets": 2,
     "numoutlets": 4,
     "patching_rect": [
      20.0,
      200.0,
      140.0,
      22.0
     ],
     "outlettype": [
      "",
      "",
      "",
      ""
     ],
     "text": "p window",
     "patcher": {
      "fileversion": 1,
      "appversion": {
       "major": 9,
       "minor": 0,
       "revision": 0,
       "architecture": "x64",
       "modernui": 1
      },
      "classnamespace": "box",
      "rect": [
       80.0,
       80.0,
       760.0,
       480.0
      ],
      "openinpresentation": 1,
      "toolbarvisible": 0,
      "statusbarvisible": 0,
      "enablehscroll": 0,
      "enablevscroll": 0,
      "title": "Reverberator",
      "boxes": [
       {
        "box": {
         "id": "obj-1",
         "maxclass": "inlet",
         "numinlets": 0,
         "numoutlets": 1,
         "patching_rect": [
          20.0,
          20.0,
          30.0,
          30.0
         ],
         "outlettype": [
          ""
         ],
         "text": "inlet",
         "comment": "window"
        }
       },
       {
        "box": {
         "id": "obj-2",
         "maxclass": "inlet",
         "numinlets": 0,
         "numoutlets": 1,
         "patching_rect": [
          120.0,
          20.0,
          30.0,
          30.0
         ],
         "outlettype": [
          ""
         ],
         "text": "inlet",
         "comment": "MIDI, bang, restore, actions"
        }
       },
       {
        "box": {
         "id": "obj-3",
         "maxclass": "v8ui",
         "numinlets": 1,
         "numoutlets": 4,
         "patching_rect": [
          120.0,
          80.0,
          760.0,
          480.0
         ],
         "outlettype": [
          "",
          "",
          "",
          ""
         ],
         "filename": "Reverberator.js",
         "parameter_enable": 0,
         "border": 0,
         "presentation": 1,
         "presentation_rect": [
          0.0,
          0.0,
          760.0,
          480.0
         ]
        }
       },
       {
        "box": {
         "id": "obj-4",
         "maxclass": "outlet",
         "numinlets": 1,
         "numoutlets": 0,
         "patching_rect": [
          120.0,
          600.0,
          30.0,
          30.0
         ],
         "text": "outlet"
        }
       },
       {
        "box": {
         "id": "obj-5",
         "maxclass": "outlet",
         "numinlets": 1,
         "numoutlets": 0,
         "patching_rect": [
          240.0,
          600.0,
          30.0,
          30.0
         ],
         "text": "outlet"
        }
       },
       {
        "box": {
         "id": "obj-6",
         "maxclass": "outlet",
         "numinlets": 1,
         "numoutlets": 0,
         "patching_rect": [
          360.0,
          600.0,
          30.0,
          30.0
         ],
         "text": "outlet"
        }
       },
       {
        "box": {
         "id": "obj-7",
         "maxclass": "outlet",
         "numinlets": 1,
         "numoutlets": 0,
         "patching_rect": [
          480.0,
          600.0,
          30.0,
          30.0
         ],
         "text": "outlet"
        }
       },
       {
        "box": {
         "id": "obj-8",
         "maxclass": "newobj",
         "numinlets": 0,
         "numoutlets": 4,
         "patching_rect": [
          320.0,
          20.0,
          40.0,
          22.0
         ],
         "outlettype": [
          "int",
          "int",
          "int",
          "int"
         ],
         "text": "key"
        }
       },
       {
        "box": {
         "id": "obj-9",
         "maxclass": "newobj",
         "numinlets": 1,
         "numoutlets": 1,
         "patching_rect": [
          320.0,
          50.0,
          75.0,
          22.0
         ],
         "outlettype": [
          ""
         ],
         "text": "prepend key"
        }
       }
      ],
      "lines": [
       {
        "patchline": {
         "source": [
          "obj-8",
          0
         ],
         "destination": [
          "obj-9",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-9",
          0
         ],
         "destination": [
          "obj-3",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-2",
          0
         ],
         "destination": [
          "obj-3",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-3",
          0
         ],
         "destination": [
          "obj-4",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-3",
          1
         ],
         "destination": [
          "obj-5",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-3",
          2
         ],
         "destination": [
          "obj-6",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-3",
          3
         ],
         "destination": [
          "obj-7",
          0
         ]
        }
       }
      ]
     }
    }
   },
   {
    "box": {
     "id": "obj-4",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 0,
     "patching_rect": [
      20.0,
      420.0,
      55.0,
      22.0
     ],
     "text": "midiout"
    }
   },
   {
    "box": {
     "id": "obj-5",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 3,
     "patching_rect": [
      200.0,
      420.0,
      80.0,
      22.0
     ],
     "outlettype": [
      "",
      "",
      ""
     ],
     "text": "pattr state",
     "parameter_enable": 1,
     "varname": "state",
     "saved_attribute_attributes": {
      "valueof": {
       "parameter_longname": "state",
       "parameter_shortname": "state",
       "parameter_type": 3,
       "parameter_invisible": 1,
       "parameter_initial_enable": 0
      }
     }
    }
   },
   {
    "box": {
     "id": "obj-6",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 1,
     "patching_rect": [
      200.0,
      460.0,
      95.0,
      22.0
     ],
     "outlettype": [
      ""
     ],
     "text": "prepend restore"
    }
   },
   {
    "box": {
     "id": "obj-7",
     "maxclass": "comment",
     "numinlets": 1,
     "numoutlets": 0,
     "patching_rect": [
      420.0,
      420.0,
      244.0,
      40.0
     ],
     "text": "Show Window opens Reverberator's own window.",
     "presentation": 1,
     "presentation_rect": [
      8.0,
      8.0,
      244.0,
      40.0
     ],
     "linecount": 2,
     "textcolor": [
      0.867,
      0.882,
      0.906,
      1.0
     ],
     "fontsize": 11.0
    }
   },
   {
    "box": {
     "id": "obj-8",
     "maxclass": "live.text",
     "numinlets": 1,
     "numoutlets": 2,
     "patching_rect": [
      420.0,
      20.0,
      120.0,
      20.0
     ],
     "outlettype": [
      "",
      ""
     ],
     "text": "Show Window",
     "texton": "Show Window",
     "mode": 0,
     "parameter_enable": 0,
     "presentation": 1,
     "presentation_rect": [
      8.0,
      56.0,
      118.0,
      22.0
     ]
    }
   },
   {
    "box": {
     "id": "obj-9",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 3,
     "patching_rect": [
      420.0,
      60.0,
      80.0,
      22.0
     ],
     "outlettype": [
      "",
      "",
      ""
     ],
     "text": "route bang 1"
    }
   },
   {
    "box": {
     "id": "obj-10",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 1,
     "patching_rect": [
      420.0,
      100.0,
      30.0,
      22.0
     ],
     "outlettype": [
      "bang"
     ],
     "text": "t b"
    }
   },
   {
    "box": {
     "id": "obj-11",
     "maxclass": "message",
     "numinlets": 1,
     "numoutlets": 1,
     "patching_rect": [
      420.0,
      140.0,
      40.0,
      22.0
     ],
     "outlettype": [
      ""
     ],
     "text": "open"
    }
   },
   {
    "box": {
     "id": "obj-12",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 1,
     "patching_rect": [
      420.0,
      180.0,
      60.0,
      22.0
     ],
     "outlettype": [
      ""
     ],
     "text": "pcontrol"
    }
   },
   {
    "box": {
     "id": "obj-13",
     "maxclass": "newobj",
     "numinlets": 2,
     "numoutlets": 2,
     "patching_rect": [
      20.0,
      300.0,
      160.0,
      22.0
     ],
     "outlettype": [
      "signal",
      "signal"
     ],
     "text": "gen~",
     "patcher": {
      "fileversion": 1,
      "appversion": {
       "major": 9,
       "minor": 0,
       "revision": 0,
       "architecture": "x64",
       "modernui": 1
      },
      "classnamespace": "dsp.gen",
      "rect": [
       100.0,
       100.0,
       700.0,
       600.0
      ],
      "boxes": [
       {
        "box": {
         "id": "obj-1",
         "maxclass": "newobj",
         "numinlets": 0,
         "numoutlets": 1,
         "patching_rect": [
          20.0,
          20.0,
          40.0,
          22.0
         ],
         "outlettype": [
          ""
         ],
         "text": "in 1"
        }
       },
       {
        "box": {
         "id": "obj-2",
         "maxclass": "newobj",
         "numinlets": 0,
         "numoutlets": 1,
         "patching_rect": [
          140.0,
          20.0,
          40.0,
          22.0
         ],
         "outlettype": [
          ""
         ],
         "text": "in 2"
        }
       },
       {
        "box": {
         "id": "obj-3",
         "maxclass": "codebox",
         "numinlets": 2,
         "numoutlets": 2,
         "patching_rect": [
          20.0,
          80.0,
          600.0,
          400.0
         ],
         "outlettype": [
          "",
          ""
         ],
         "code": "// Reverberator \u2014 Material Reverb (Physically Modelled) - translated by ableton/kit/jsfx2gen.js. Do not edit; rebuild.\nData V(487);\nData M(524288);\nData mq(1);\nParam slider1(0, min=0, max=19);\nParam slider2(35, min=0, max=100);\nParam slider3(100, min=25, max=400);\nParam slider4(100, min=10, max=400);\nParam slider5(0, min=(-100), max=100);\nParam slider6(0, min=(-12), max=12);\nParam slider7(0, min=0, max=250);\nParam slider8(30, min=0, max=100);\nParam slider9(100, min=0, max=150);\nParam slider10(20, min=20, max=1000);\nParam slider11(20000, min=1000, max=20000);\nParam slider12(0, min=(-24), max=12);\nParam tempo(120, min=1, max=999);\nParam play_state(0, min=0, max=8);\nParam beat_position(0);\nParam ts_num(4, min=1, max=64);\nParam ts_denom(4, min=1, max=64);\n\neel_mod(a, b) { ib = trunc(abs(b)); return ib >= 1 ? trunc(abs(a)) - ib * floor(trunc(abs(a)) / ib) : 0; }\neel_bor(a, b) { return bitor(trunc(a), trunc(b)); }\neel_band(a, b) { return bitand(trunc(a), trunc(b)); }\neel_bxor(a, b) { return bitxor(trunc(a), trunc(b)); }\neel_shl(a, b) { return trunc(a) * pow(2, trunc(b)); }\neel_shr(a, b) { return floor(trunc(a) / pow(2, trunc(b))); }\n\nf_hsign(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0;\n  r = 0;\n  t1 = eel_band(p0, p1);\n  poke(V, t1, 107);\n  poke(V, 0, 108);\n  t2 = min(1048576, trunc(3));\n  for (t3 = 0; t3 < t2; t3 += 1) {\n    t4 = eel_band(peek(V, 107), 1);\n    t5 = (peek(V, 108) + t4);\n    poke(V, t5, 108);\n    t6 = eel_shr(peek(V, 107), 1);\n    poke(V, t6, 107);\n  }\n  r = (1 - (2 * eel_band(peek(V, 108), 1)));\n  return r;\n}\n\nf_jz(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0;\n  r = 0;\n  t1 = trunc(peek(V, 95) + (peek(V, 106) * 2) + 0.00001);\n  t2 = p0;\n  poke(M, t2, t1);\n  t3 = trunc(peek(V, 95) + ((peek(V, 106) * 2) + 1) + 0.00001);\n  t4 = p1;\n  poke(M, t4, t3);\n  t5 = (peek(V, 106) + 1);\n  poke(V, t5, 106);\n  r = t5;\n  return r;\n}\n\nf_ui_knob(V, M, mq, p0, p1, p2, p3, p4, p5, p6) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0;\n  r = 0;\n  t1 = trunc(peek(V, 113) + (p0 * 6) + 0.00001);\n  t2 = p1;\n  poke(M, t2, t1);\n  t3 = trunc(peek(V, 113) + ((p0 * 6) + 1) + 0.00001);\n  t4 = p2;\n  poke(M, t4, t3);\n  t5 = trunc(peek(V, 113) + ((p0 * 6) + 2) + 0.00001);\n  t6 = p3;\n  poke(M, t6, t5);\n  t7 = trunc(peek(V, 113) + ((p0 * 6) + 3) + 0.00001);\n  t8 = p4;\n  poke(M, t8, t7);\n  t9 = trunc(peek(V, 113) + ((p0 * 6) + 4) + 0.00001);\n  t10 = p5;\n  poke(M, t10, t9);\n  t11 = trunc(peek(V, 113) + ((p0 * 6) + 5) + 0.00001);\n  t12 = p6;\n  poke(M, t12, t11);\n  r = t12;\n  return r;\n}\n\nf_t60e(V, M, mq, p0, p1, p2) {\n  r = 0;\n  r = (1 / ((1 / p2) + ((p0 * p1) / 2.2)));\n  return r;\n}\n\nf_gd1(V, M, mq, p0, p1) {\n  r = 0;\n  r = ((1 - (p1 * p1)) / ((1 + ((2 * p1) * cos(p0))) + (p1 * p1)));\n  return r;\n}\n\nf_disp_diff(V, M, mq, p0) {\n  t1 = 0; t2 = 0; t3 = 0;\n  r = 0;\n  t1 = (peek(V, 201) * peek(V, 202));\n  t2 = f_gd1(V, M, mq, (peek(V, 202) * peek(V, 203)), p0);\n  t3 = f_gd1(V, M, mq, (peek(V, 202) * peek(V, 204)), p0);\n  r = (t1 * (t2 - t3));\n  return r;\n}\n\nf_disp_solve(V, M, mq, p0) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0;\n  r = 0;\n  if ((abs((((abs((peek(V, 201) <= 0 ? 1 : 0)) >= 0.00001) || (abs((p0 <= 0 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n    r = 0;\n  }\n  else {\n    t1 = peek(V, 110);\n    poke(V, t1, 205);\n    poke(V, 0, 206);\n    t2 = f_disp_diff(V, M, mq, peek(V, 205));\n    if ((abs((t2 <= p0 ? 1 : 0)) >= 0.00001)) {\n      r = peek(V, 205);\n    }\n    else {\n      t3 = min(1048576, trunc(40));\n      for (t4 = 0; t4 < t3; t4 += 1) {\n        t5 = (0.5 * (peek(V, 205) + peek(V, 206)));\n        poke(V, t5, 207);\n        t6 = f_disp_diff(V, M, mq, peek(V, 207));\n        if ((abs((t6 > p0 ? 1 : 0)) >= 0.00001)) {\n          t7 = peek(V, 207);\n          poke(V, t7, 205);\n        }\n        else {\n          t8 = peek(V, 207);\n          poke(V, t8, 206);\n        }\n      }\n      r = (0.5 * (peek(V, 205) + peek(V, 206)));\n    }\n  }\n  return r;\n}\n\nf_op_fit(V, M, mq, p0, p1, p2) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0;\n  r = 0;\n  t1 = min(p0, 0.9999995);\n  p0 = t1;\n  t2 = min(p1, p0);\n  p1 = t2;\n  t3 = pow((p1 / p0), 2);\n  poke(V, t3, 213);\n  if ((abs((peek(V, 213) > 0.999999 ? 1 : 0)) >= 0.00001)) {\n    poke(V, 0, 214);\n    t4 = p0;\n    poke(V, t4, 215);\n    r = t4;\n  }\n  else {\n    t5 = cos(p2);\n    poke(V, t5, 216);\n    t6 = (1 - peek(V, 213));\n    poke(V, t6, 217);\n    t7 = (1 - (peek(V, 213) * peek(V, 216)));\n    poke(V, t7, 218);\n    t8 = max(0, ((peek(V, 218) * peek(V, 218)) - (peek(V, 217) * peek(V, 217))));\n    poke(V, t8, 219);\n    t9 = max(0, min(0.9995, ((peek(V, 218) - sqrt(abs(peek(V, 219)))) / peek(V, 217))));\n    poke(V, t9, 214);\n    t10 = (p0 * (1 - peek(V, 214)));\n    poke(V, t10, 215);\n    r = t10;\n  }\n  return r;\n}\n\nf_ph1(V, M, mq, p0, p1) {\n  r = 0;\n  r = (p0 - (2 * atan(((p1 * sin(p0)) / (1 + (p1 * cos(p0)))))));\n  return r;\n}\n\nf_phlp(V, M, mq, p0, p1) {\n  r = 0;\n  r = atan2((p1 * sin(p0)), (1 - (p1 * cos(p0))));\n  return r;\n}\n\nf_gdlp(V, M, mq, p0, p1) {\n  r = 0;\n  r = (((p1 * cos(p0)) - (p1 * p1)) / ((1 - ((2 * p1) * cos(p0))) + (p1 * p1)));\n  return r;\n}\n\nf_loop_energy(V, M, mq, p0, p1) {\n  t1 = 0;\n  r = 0;\n  t1 = ((1 + (p1 * p1)) - (p0 * p0));\n  poke(V, t1, 228);\n  r = ((p0 * p0) / sqrt(abs(max(1e-12, ((peek(V, 228) * peek(V, 228)) - ((4 * p1) * p1))))));\n  return r;\n}\n\nf_wg_make(V, M, mq) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0; t39 = 0; t40 = 0; t41 = 0; t42 = 0; t43 = 0; t44 = 0; t45 = 0; t46 = 0; t47 = 0; t48 = 0; t49 = 0; t50 = 0; t51 = 0; t52 = 0; t53 = 0; t54 = 0; t55 = 0; t56 = 0; t57 = 0; t58 = 0; t59 = 0; t60 = 0; t61 = 0; t62 = 0; t63 = 0; t64 = 0; t65 = 0; t66 = 0; t67 = 0; t68 = 0; t69 = 0; t70 = 0; t71 = 0; t72 = 0; t73 = 0; t74 = 0; t75 = 0; t76 = 0; t77 = 0; t78 = 0; t79 = 0; t80 = 0; t81 = 0; t82 = 0; t83 = 0; t84 = 0; t85 = 0; t86 = 0; t87 = 0; t88 = 0;\n  r = 0;\n  t1 = (peek(V, 86) + (peek(V, 139) * peek(V, 85)));\n  poke(V, t1, 192);\n  if ((abs((((abs((((abs((peek(V, 139) < peek(V, 84) ? 1 : 0)) >= 0.00001) && (abs(((abs((((abs(peek(V, 133)) >= 0.00001) && (abs(peek(V, 134)) >= 0.00001)) ? 1 : 0)) >= 0.00001) ? 0 : 1)) >= 0.00001)) ? 1 : 0)) >= 0.00001) && (abs((((abs(peek(V, 133)) >= 0.00001) || (abs((peek(V, 139) < peek(V, 193) ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n    t2 = ((0.4 * peek(V, 78)) / peek(V, 188));\n    poke(V, t2, 194);\n    t3 = (peek(V, 179) * peek(V, 131));\n    poke(V, t3, 195);\n    t4 = min((peek(V, 183) * peek(V, 131)), peek(V, 194));\n    poke(V, t4, 196);\n    t5 = (peek(V, 180) / peek(V, 131));\n    poke(V, t5, 197);\n    t6 = (peek(V, 184) / peek(V, 131));\n    poke(V, t6, 198);\n    t7 = (((2 * 3.141592653589793) * peek(V, 195)) / peek(V, 78));\n    poke(V, t7, 199);\n    t8 = (((2 * 3.141592653589793) * peek(V, 196)) / peek(V, 78));\n    poke(V, t8, 200);\n    t9 = peek(V, 187);\n    poke(V, t9, 201);\n    t10 = peek(V, 188);\n    poke(V, t10, 202);\n    t11 = peek(V, 199);\n    poke(V, t11, 203);\n    t12 = peek(V, 200);\n    poke(V, t12, 204);\n    t13 = f_disp_solve(V, M, mq, ((peek(V, 197) - peek(V, 198)) * peek(V, 78)));\n    poke(V, t13, 208);\n    t14 = (peek(V, 185) * peek(V, 137));\n    poke(V, t14, 209);\n    t15 = min(peek(V, 209), ((peek(V, 186) * peek(V, 137)) * peek(V, 138)));\n    poke(V, t15, 210);\n    t16 = pow(10, (((-3) * peek(V, 197)) / peek(V, 209)));\n    poke(V, t16, 211);\n    t17 = pow(10, (((-3) * peek(V, 198)) / peek(V, 210)));\n    poke(V, t17, 212);\n    t18 = f_op_fit(V, M, mq, peek(V, 211), peek(V, 212), peek(V, 200));\n    if ((abs(peek(V, 175)) >= 0.00001)) {\n      t19 = ((((2 * 3.141592653589793) * peek(V, 178)) * peek(V, 131)) / peek(V, 78));\n      poke(V, t19, 220);\n      t20 = peek(V, 176);\n      t21 = peek(V, 187);\n      t22 = f_ph1(V, M, mq, (peek(V, 188) * peek(V, 220)), peek(V, 208));\n      t23 = (t20 - (t21 * t22));\n      t24 = f_phlp(V, M, mq, peek(V, 220), peek(V, 214));\n      t25 = (t23 - t24);\n      poke(V, t25, 221);\n      t26 = (peek(V, 221) / peek(V, 220));\n      poke(V, t26, 222);\n    }\n    else {\n      t27 = peek(V, 200);\n      poke(V, t27, 220);\n      t28 = (peek(V, 198) * peek(V, 78));\n      t29 = (peek(V, 187) * peek(V, 188));\n      t30 = f_gd1(V, M, mq, (peek(V, 188) * peek(V, 200)), peek(V, 208));\n      t31 = (t28 - (t29 * t30));\n      t32 = f_gdlp(V, M, mq, peek(V, 200), peek(V, 214));\n      t33 = (t31 - t32);\n      poke(V, t33, 222);\n    }\n    t34 = floor((peek(V, 222) - 0.5));\n    poke(V, t34, 223);\n    if ((abs((peek(V, 223) < 2 ? 1 : 0)) >= 0.00001)) {\n      poke(V, 2, 223);\n    }\n    t35 = (peek(V, 222) - peek(V, 223));\n    poke(V, t35, 224);\n    if ((abs((peek(V, 224) < 0.1 ? 1 : 0)) >= 0.00001)) {\n      poke(V, 0.1, 224);\n    }\n    t36 = ((1 - peek(V, 224)) / (1 + peek(V, 224)));\n    poke(V, t36, 225);\n    if ((abs(peek(V, 175)) >= 0.00001)) {\n      t37 = min(1048576, trunc(3));\n      for (t38 = 0; t38 < t37; t38 += 1) {\n        t39 = (peek(V, 222) - peek(V, 223));\n        t40 = f_ph1(V, M, mq, peek(V, 220), peek(V, 225));\n        t41 = (t39 - (t40 / peek(V, 220)));\n        t42 = (peek(V, 224) + t41);\n        poke(V, t42, 224);\n        t43 = max(0.1, min(1.9, peek(V, 224)));\n        poke(V, t43, 224);\n        t44 = ((1 - peek(V, 224)) / (1 + peek(V, 224)));\n        poke(V, t44, 225);\n      }\n    }\n    if ((abs(peek(V, 133)) >= 0.00001)) {\n      t45 = (peek(V, 223) + 8);\n      poke(V, t45, 226);\n      t46 = ((2 * peek(V, 187)) * peek(V, 188));\n      poke(V, t46, 227);\n      if ((abs((((abs(((peek(V, 135) + peek(V, 226)) < peek(V, 99) ? 1 : 0)) >= 0.00001) && (abs(((peek(V, 136) + peek(V, 227)) < peek(V, 97) ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n        t47 = trunc(peek(V, 192) + 0.00001);\n        t48 = peek(V, 135);\n        poke(M, t48, t47);\n        t49 = trunc(peek(V, 192) + 1 + 0.00001);\n        t50 = peek(V, 226);\n        poke(M, t50, t49);\n        t51 = trunc(peek(V, 192) + 2 + 0.00001);\n        poke(M, 0, t51);\n        t52 = peek(V, 226);\n        t53 = (peek(V, 135) + t52);\n        poke(V, t53, 135);\n        t54 = trunc(peek(V, 192) + 13 + 0.00001);\n        t55 = peek(V, 136);\n        poke(M, t55, t54);\n        t56 = peek(V, 227);\n        t57 = (peek(V, 136) + t56);\n        poke(V, t57, 136);\n        t58 = trunc(peek(V, 192) + 5 + 0.00001);\n        t59 = trunc(peek(V, 192) + 6 + 0.00001);\n        t60 = trunc(peek(V, 192) + 9 + 0.00001);\n        poke(M, 0, t60);\n        poke(M, 0, t59);\n        poke(M, 0, t58);\n      }\n      else {\n        poke(V, 1, 134);\n      }\n    }\n    else {\n      t61 = min(peek(V, 223), (peek(M, trunc(peek(V, 192) + 1 + 0.00001)) - 2));\n      poke(V, t61, 223);\n    }\n    if ((abs(((abs((((abs(peek(V, 133)) >= 0.00001) && (abs(peek(V, 134)) >= 0.00001)) ? 1 : 0)) >= 0.00001) ? 0 : 1)) >= 0.00001)) {\n      t62 = trunc(peek(V, 192) + 3 + 0.00001);\n      t63 = peek(V, 223);\n      poke(M, t63, t62);\n      t64 = trunc(peek(V, 192) + 4 + 0.00001);\n      t65 = peek(V, 225);\n      poke(M, t65, t64);\n      t66 = trunc(peek(V, 192) + 7 + 0.00001);\n      t67 = (peek(V, 215) * peek(V, 177));\n      poke(M, t67, t66);\n      t68 = trunc(peek(V, 192) + 8 + 0.00001);\n      t69 = peek(V, 214);\n      poke(M, t69, t68);\n      t70 = trunc(peek(V, 192) + 10 + 0.00001);\n      t71 = peek(V, 187);\n      poke(M, t71, t70);\n      t72 = trunc(peek(V, 192) + 11 + 0.00001);\n      t73 = peek(V, 208);\n      poke(M, t73, t72);\n      t74 = trunc(peek(V, 192) + 12 + 0.00001);\n      t75 = peek(V, 188);\n      poke(M, t75, t74);\n      t76 = trunc(peek(V, 192) + 14 + 0.00001);\n      t77 = peek(V, 189);\n      poke(M, t77, t76);\n      t78 = trunc(peek(V, 192) + 15 + 0.00001);\n      t79 = peek(V, 190);\n      poke(M, t79, t78);\n      t80 = trunc(peek(V, 192) + 16 + 0.00001);\n      t81 = peek(V, 191);\n      poke(M, t81, t80);\n      t82 = trunc(peek(V, 192) + 17 + 0.00001);\n      t83 = f_loop_energy(V, M, mq, peek(V, 215), peek(V, 214));\n      poke(M, t83, t82);\n      t84 = trunc(peek(V, 192) + 18 + 0.00001);\n      t85 = ((abs(peek(V, 175)) >= 0.00001) ? (peek(V, 178) * peek(V, 131)) : 0);\n      poke(M, t85, t84);\n      t86 = trunc(peek(V, 192) + 19 + 0.00001);\n      t87 = peek(V, 209);\n      poke(M, t87, t86);\n      t88 = (peek(V, 139) + 1);\n      poke(V, t88, 139);\n      r = t88;\n    }\n    else {\n      r = 0;\n    }\n  }\n  else {\n    r = 0;\n  }\n  return r;\n}\n\nf_string_add(V, M, mq, p0, p1, p2, p3, p4, p5, p6, p7, p8) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0;\n  r = 0;\n  poke(V, 1, 175);\n  t1 = (2 * 3.141592653589793);\n  poke(V, t1, 176);\n  poke(V, 1, 177);\n  t2 = (p0 * sqrt(abs((1 + p1))));\n  poke(V, t2, 178);\n  t3 = peek(V, 178);\n  poke(V, t3, 179);\n  t4 = (sqrt(abs((1 + p1))) / (p0 * (1 + (2 * p1))));\n  poke(V, t4, 180);\n  t5 = min(4000, ((0.3 * peek(V, 78)) / (peek(V, 131) * p5)));\n  poke(V, t5, 181);\n  t6 = (peek(V, 181) / p0);\n  poke(V, t6, 182);\n  t7 = min(1048576, trunc(30));\n  for (t8 = 0; t8 < t7; t8 += 1) {\n    t9 = (0.5 * (peek(V, 182) + (peek(V, 181) / (p0 * sqrt(abs((1 + ((p1 * peek(V, 182)) * peek(V, 182)))))))));\n    poke(V, t9, 182);\n  }\n  t10 = max(peek(V, 182), 2);\n  poke(V, t10, 182);\n  t11 = ((peek(V, 182) * p0) * sqrt(abs((1 + ((p1 * peek(V, 182)) * peek(V, 182))))));\n  poke(V, t11, 183);\n  t12 = (sqrt(abs((1 + ((p1 * peek(V, 182)) * peek(V, 182))))) / (p0 * (1 + (((2 * p1) * peek(V, 182)) * peek(V, 182)))));\n  poke(V, t12, 184);\n  t13 = f_t60e(V, M, mq, peek(V, 179), p2, p3);\n  poke(V, t13, 185);\n  t14 = f_t60e(V, M, mq, peek(V, 183), p2, p3);\n  poke(V, t14, 186);\n  t15 = p4;\n  poke(V, t15, 187);\n  t16 = p5;\n  poke(V, t16, 188);\n  t17 = p6;\n  poke(V, t17, 189);\n  t18 = p7;\n  poke(V, t18, 190);\n  t19 = p8;\n  poke(V, t19, 191);\n  t20 = f_wg_make(V, M, mq);\n  r = t20;\n  return r;\n}\n\nf_wire_add(V, M, mq, p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11) {\n  t1 = 0; t2 = 0;\n  r = 0;\n  t1 = ((((p3 * 3.141592653589793) * p1) * p1) / 4);\n  poke(V, t1, 174);\n  t2 = f_string_add(V, M, mq, (sqrt(abs((p2 / peek(V, 174)))) / (2 * p0)), (((pow(3.141592653589793, 3) * p4) * pow(p1, 4)) / (((64 * p2) * p0) * p0)), p5, p6, p7, p8, p9, p10, p11);\n  r = t2;\n  return r;\n}\n\nf_brt(V, M, mq, p0) {\n  t1 = 0;\n  r = 0;\n  t1 = (log((max(p0, 1) / 500)) / log(8));\n  poke(V, t1, 235);\n  r = pow(peek(V, 138), max(0, min(1, peek(V, 235))));\n  return r;\n}\n\nf_mode_add(V, M, mq, p0, p1, p2, p3, p4, p5) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0;\n  r = 0;\n  t1 = sqrt(abs(((p0 * p0) + (peek(V, 142) * peek(V, 142)))));\n  p0 = t1;\n  t2 = (p0 * peek(V, 131));\n  poke(V, t2, 232);\n  if ((abs((((abs((((abs((((abs((peek(V, 232) > 16 ? 1 : 0)) >= 0.00001) && (abs((peek(V, 232) < (0.45 * peek(V, 78)) ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001) && (abs((peek(V, 140) < peek(V, 87) ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001) && (abs((((abs(peek(V, 133)) >= 0.00001) || (abs((peek(V, 140) < peek(V, 233) ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n    t3 = (peek(V, 89) + (peek(V, 140) * peek(V, 88)));\n    poke(V, t3, 234);\n    t4 = f_t60e(V, M, mq, p0, p1, p2);\n    t5 = (t4 * peek(V, 137));\n    t6 = f_brt(V, M, mq, peek(V, 232));\n    t7 = (t5 * t6);\n    poke(V, t7, 236);\n    t8 = exp(((-6.907755) / (peek(V, 236) * peek(V, 78))));\n    poke(V, t8, 237);\n    t9 = min(peek(V, 237), 0.9999999);\n    poke(V, t9, 237);\n    t10 = (((2 * 3.141592653589793) * peek(V, 232)) / peek(V, 78));\n    poke(V, t10, 238);\n    t11 = trunc(peek(V, 234) + 0.00001);\n    t12 = ((2 * peek(V, 237)) * cos(peek(V, 238)));\n    poke(M, t12, t11);\n    t13 = trunc(peek(V, 234) + 1 + 0.00001);\n    t14 = (peek(V, 237) * peek(V, 237));\n    poke(M, t14, t13);\n    if ((abs(peek(V, 133)) >= 0.00001)) {\n      t15 = trunc(peek(V, 234) + 2 + 0.00001);\n      poke(M, 0, t15);\n      t16 = trunc(peek(V, 234) + 3 + 0.00001);\n      poke(M, 0, t16);\n    }\n    t17 = trunc(peek(V, 234) + 4 + 0.00001);\n    t18 = ((p3 * p4) * sin(peek(V, 238)));\n    poke(M, t18, t17);\n    t19 = trunc(peek(V, 234) + 5 + 0.00001);\n    t20 = ((p3 * p5) * sin(peek(V, 238)));\n    poke(M, t20, t19);\n    t21 = trunc(peek(V, 234) + 6 + 0.00001);\n    t22 = (((2 * peek(V, 237)) * peek(V, 238)) * sin(peek(V, 238)));\n    poke(M, t22, t21);\n    t23 = trunc(peek(V, 234) + 7 + 0.00001);\n    t24 = (p3 * p4);\n    poke(M, t24, t23);\n    t25 = trunc(peek(V, 234) + 8 + 0.00001);\n    t26 = (p3 * p5);\n    poke(M, t26, t25);\n    t27 = trunc(peek(V, 234) + 9 + 0.00001);\n    t28 = peek(V, 237);\n    poke(M, t28, t27);\n    t29 = trunc(peek(V, 234) + 10 + 0.00001);\n    t30 = peek(V, 232);\n    poke(M, t30, t29);\n    t31 = trunc(peek(V, 234) + 11 + 0.00001);\n    t32 = peek(V, 236);\n    poke(M, t32, t31);\n    t33 = (peek(V, 140) + 1);\n    poke(V, t33, 140);\n    r = t33;\n  }\n  else {\n    r = 0;\n  }\n  return r;\n}\n\nf_fdn_setup(V, M, mq, p0, p1, p2, p3, p4) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0; t39 = 0; t40 = 0; t41 = 0; t42 = 0; t43 = 0; t44 = 0; t45 = 0; t46 = 0; t47 = 0; t48 = 0; t49 = 0; t50 = 0; t51 = 0; t52 = 0; t53 = 0; t54 = 0; t55 = 0; t56 = 0; t57 = 0; t58 = 0; t59 = 0; t60 = 0; t61 = 0; t62 = 0; t63 = 0; t64 = 0; t65 = 0; t66 = 0; t67 = 0; t68 = 0; t69 = 0;\n  r = 0;\n  t1 = (p1 * peek(V, 137));\n  poke(V, t1, 239);\n  t2 = peek(V, 239);\n  poke(V, t2, 240);\n  t3 = (p0 / peek(V, 131));\n  poke(V, t3, 241);\n  t4 = min((p0 / peek(V, 131)), (0.3 * peek(V, 239)));\n  poke(V, t4, 242);\n  t5 = max(0.004, min(3, peek(V, 242)));\n  poke(V, t5, 242);\n  t6 = min((4000 * peek(V, 131)), (0.4 * peek(V, 78)));\n  poke(V, t6, 243);\n  t7 = (((2 * 3.141592653589793) * peek(V, 243)) / peek(V, 78));\n  poke(V, t7, 244);\n  poke(V, 0, 245);\n  poke(V, 0, 246);\n  t8 = min(1048576, trunc(8));\n  for (t9 = 0; t9 < t8; t9 += 1) {\n    t10 = trunc(peek(V, 92) + peek(V, 246) + 0.00001);\n    t11 = exp((((p4 * 0.8) * (peek(V, 246) - 3.5)) / 3.5));\n    poke(M, t11, t10);\n    t12 = peek(M, trunc(peek(V, 92) + peek(V, 246) + 0.00001));\n    t13 = (peek(V, 245) + t12);\n    poke(V, t13, 245);\n    t14 = (peek(V, 246) + 1);\n    poke(V, t14, 246);\n  }\n  t15 = peek(V, 91);\n  poke(V, t15, 247);\n  poke(V, 0, 246);\n  t16 = peek(V, 143);\n  poke(V, t16, 248);\n  poke(V, 1, 141);\n  t17 = min(1048576, trunc(8));\n  r = 0;\n  for (t18 = 0; t18 < t17; t18 += 1) {\n    t19 = ((peek(V, 242) * peek(M, trunc(peek(V, 92) + peek(V, 246) + 0.00001))) / peek(V, 245));\n    poke(V, t19, 249);\n    t20 = (peek(V, 249) * p3);\n    poke(V, t20, 250);\n    t21 = peek(V, 248);\n    poke(V, t21, 201);\n    poke(V, 1, 202);\n    t22 = ((((2 * 3.141592653589793) * 200) * peek(V, 131)) / peek(V, 78));\n    poke(V, t22, 203);\n    t23 = peek(V, 244);\n    poke(V, t23, 204);\n    t24 = f_disp_solve(V, M, mq, ((peek(V, 250) - peek(V, 249)) * peek(V, 78)));\n    poke(V, t24, 251);\n    t25 = (peek(V, 249) * peek(V, 78));\n    t26 = peek(V, 248);\n    t27 = f_gd1(V, M, mq, peek(V, 244), peek(V, 251));\n    t28 = (floor(((t25 - (t26 * t27)) + 0.5)) + peek(V, 246));\n    poke(V, t28, 252);\n    if ((abs((peek(V, 252) < 2 ? 1 : 0)) >= 0.00001)) {\n      poke(V, 2, 252);\n    }\n    t29 = eel_bor(peek(V, 252), 1);\n    poke(V, t29, 252);\n    t30 = peek(V, 252);\n    t31 = peek(V, 248);\n    t32 = f_gd1(V, M, mq, 0, peek(V, 251));\n    t33 = (t30 + (t31 * t32));\n    poke(V, t33, 253);\n    t34 = peek(V, 252);\n    t35 = peek(V, 248);\n    t36 = f_gd1(V, M, mq, peek(V, 244), peek(V, 251));\n    t37 = (t34 + (t35 * t36));\n    poke(V, t37, 254);\n    t38 = min(peek(V, 239), ((p2 * peek(V, 137)) * peek(V, 138)));\n    poke(V, t38, 255);\n    t39 = f_op_fit(V, M, mq, pow(10, (((-3) * peek(V, 253)) / (peek(V, 239) * peek(V, 78)))), pow(10, (((-3) * peek(V, 254)) / (peek(V, 255) * peek(V, 78)))), peek(V, 244));\n    if ((abs(peek(V, 133)) >= 0.00001)) {\n      t40 = (peek(V, 252) + 8);\n      poke(V, t40, 256);\n      if ((abs((((abs(((peek(V, 135) + peek(V, 256)) < peek(V, 99) ? 1 : 0)) >= 0.00001) && (abs(((peek(V, 136) + (2 * peek(V, 248))) < peek(V, 97) ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n        t41 = trunc(peek(V, 247) + 0.00001);\n        t42 = peek(V, 135);\n        poke(M, t42, t41);\n        t43 = trunc(peek(V, 247) + 1 + 0.00001);\n        t44 = peek(V, 256);\n        poke(M, t44, t43);\n        t45 = trunc(peek(V, 247) + 2 + 0.00001);\n        poke(M, 0, t45);\n        t46 = trunc(peek(V, 247) + 6 + 0.00001);\n        poke(M, 0, t46);\n        t47 = peek(V, 256);\n        t48 = (peek(V, 135) + t47);\n        poke(V, t48, 135);\n        t49 = trunc(peek(V, 247) + 9 + 0.00001);\n        t50 = peek(V, 136);\n        poke(M, t50, t49);\n        t51 = (2 * peek(V, 248));\n        t52 = (peek(V, 136) + t51);\n        poke(V, t52, 136);\n      }\n      else {\n        poke(V, 0, 141);\n      }\n    }\n    else {\n      t53 = peek(V, 257);\n      poke(V, t53, 141);\n      t54 = min(peek(V, 252), (peek(M, trunc(peek(V, 247) + 1 + 0.00001)) - 2));\n      poke(V, t54, 252);\n    }\n    t55 = trunc(peek(V, 247) + 3 + 0.00001);\n    t56 = peek(V, 252);\n    poke(M, t56, t55);\n    t57 = trunc(peek(V, 247) + 4 + 0.00001);\n    t58 = peek(V, 215);\n    poke(M, t58, t57);\n    t59 = trunc(peek(V, 247) + 5 + 0.00001);\n    t60 = peek(V, 214);\n    poke(M, t60, t59);\n    t61 = trunc(peek(V, 247) + 7 + 0.00001);\n    t62 = peek(V, 248);\n    poke(M, t62, t61);\n    t63 = trunc(peek(V, 247) + 8 + 0.00001);\n    t64 = peek(V, 251);\n    poke(M, t64, t63);\n    t65 = trunc(peek(V, 247) + 10 + 0.00001);\n    t66 = f_loop_energy(V, M, mq, peek(V, 215), peek(V, 214));\n    poke(M, t66, t65);\n    t67 = peek(V, 90);\n    t68 = (peek(V, 247) + t67);\n    poke(V, t68, 247);\n    t69 = (peek(V, 246) + 1);\n    poke(V, t69, 246);\n    r = t69;\n  }\n  return r;\n}\n\nf_chirp_add(V, M, mq, p0, p1, p2, p3, p4, p5, p6, p7, p8, p9) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0;\n  r = 0;\n  poke(V, 0, 175);\n  poke(V, 1, 177);\n  t1 = (2 * 3.141592653589793);\n  poke(V, t1, 176);\n  t2 = p0;\n  poke(V, t2, 178);\n  t3 = p0;\n  poke(V, t3, 179);\n  t4 = p1;\n  poke(V, t4, 180);\n  t5 = p2;\n  poke(V, t5, 183);\n  t6 = p3;\n  poke(V, t6, 184);\n  t7 = p4;\n  poke(V, t7, 185);\n  t8 = p5;\n  poke(V, t8, 186);\n  t9 = p6;\n  poke(V, t9, 187);\n  t10 = max(1, floor(((peek(V, 78) / 12000) + 0.5)));\n  poke(V, t10, 188);\n  t11 = p7;\n  poke(V, t11, 189);\n  t12 = p8;\n  poke(V, t12, 190);\n  t13 = p9;\n  poke(V, t13, 191);\n  poke(V, (-0.72), 110);\n  t14 = f_wg_make(V, M, mq);\n  poke(V, (-0.9), 110);\n  r = (-0.9);\n  return r;\n}\n\nf_plate_density(V, M, mq, p0, p1, p2) {\n  r = 0;\n  r = ((0.5 * p0) * sqrt(abs((p1 / p2))));\n  return r;\n}\n\nf_tube_alpha(V, M, mq, p0, p1) {\n  r = 0;\n  r = ((sqrt(abs((3.141592653589793 * p0))) * peek(V, 105)) / (p1 * peek(V, 100)));\n  return r;\n}\n\nf_tube_add(V, M, mq, p0, p1, p2, p3, p4, p5, p6) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0;\n  r = 0;\n  t1 = (p0 + ((p2 * 0.6133) * p1));\n  poke(V, t1, 266);\n  t2 = ((abs((abs(p2 - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.5 : 1);\n  poke(V, t2, 267);\n  t3 = ((peek(V, 267) * peek(V, 100)) / (2 * peek(V, 266)));\n  poke(V, t3, 268);\n  t4 = min(1048576, trunc(8));\n  for (t5 = 0; t5 < t4; t5 += 1) {\n    t6 = ((peek(V, 267) * peek(V, 100)) / (2 * peek(V, 266)));\n    t7 = f_tube_alpha(V, M, mq, peek(V, 268), p1);\n    t8 = (t6 / (1 + ((t7 * peek(V, 100)) / ((2 * 3.141592653589793) * peek(V, 268)))));\n    poke(V, t8, 268);\n  }\n  poke(V, 1, 175);\n  t9 = ((abs((abs(p2 - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 3.141592653589793 : (2 * 3.141592653589793));\n  poke(V, t9, 176);\n  t10 = ((abs((abs(p2 - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? (-1) : 1);\n  poke(V, t10, 177);\n  t11 = peek(V, 268);\n  poke(V, t11, 178);\n  t12 = peek(V, 268);\n  poke(V, t12, 179);\n  t13 = min(4000, ((0.3 * peek(V, 78)) / peek(V, 131)));\n  poke(V, t13, 269);\n  t14 = peek(V, 269);\n  poke(V, t14, 183);\n  t15 = (2 * peek(V, 266));\n  t16 = (1 / peek(V, 100));\n  t17 = f_tube_alpha(V, M, mq, peek(V, 268), p1);\n  t18 = (t15 * (t16 + (t17 / ((4 * 3.141592653589793) * peek(V, 268)))));\n  poke(V, t18, 180);\n  t19 = (2 * peek(V, 266));\n  t20 = (1 / peek(V, 100));\n  t21 = f_tube_alpha(V, M, mq, peek(V, 269), p1);\n  t22 = (t19 * (t20 + (t21 / ((4 * 3.141592653589793) * peek(V, 269)))));\n  poke(V, t22, 184);\n  t23 = ((((2 * 3.141592653589793) * peek(V, 268)) * p1) / peek(V, 100));\n  poke(V, t23, 270);\n  t24 = exp(((((-0.5) * peek(V, 270)) * peek(V, 270)) * p2));\n  poke(V, t24, 271);\n  t25 = ((((2 * 3.141592653589793) * peek(V, 269)) * p1) / peek(V, 100));\n  poke(V, t25, 270);\n  t26 = exp(((((-0.5) * peek(V, 270)) * peek(V, 270)) * p2));\n  poke(V, t26, 272);\n  t27 = (((-2) * peek(V, 266)) * p3);\n  t28 = f_tube_alpha(V, M, mq, peek(V, 268), p1);\n  t29 = (exp((t27 * t28)) * peek(V, 271));\n  poke(V, t29, 273);\n  t30 = (((-2) * peek(V, 266)) * p3);\n  t31 = f_tube_alpha(V, M, mq, peek(V, 269), p1);\n  t32 = (exp((t30 * t31)) * peek(V, 272));\n  poke(V, t32, 274);\n  t33 = (((-6.9078) * peek(V, 180)) / log(min(peek(V, 273), 0.99999)));\n  poke(V, t33, 185);\n  t34 = (((-6.9078) * peek(V, 184)) / log(max(min(peek(V, 274), 0.99999), 0.000001)));\n  poke(V, t34, 186);\n  poke(V, 2, 187);\n  poke(V, 1, 188);\n  t35 = p4;\n  poke(V, t35, 189);\n  t36 = p5;\n  poke(V, t36, 190);\n  t37 = p6;\n  poke(V, t37, 191);\n  t38 = f_wg_make(V, M, mq);\n  r = t38;\n  return r;\n}\n\nf_ring_modes(V, M, mq, p0, p1, p2, p3, p4, p5, p6, p7, p8) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0;\n  r = 0;\n  t1 = (((p1 / ((p0 * p0) * sqrt(abs(12)))) * sqrt(abs((p2 / (p3 * (1 - (p4 * p4))))))) / (2 * 3.141592653589793));\n  poke(V, t1, 275);\n  poke(V, 2, 276);\n  t2 = min(1048576, trunc((p7 - 1)));\n  r = 0;\n  for (t3 = 0; t3 < t2; t3 += 1) {\n    t4 = (((peek(V, 275) * peek(V, 276)) * ((peek(V, 276) * peek(V, 276)) - 1)) / sqrt(abs(((peek(V, 276) * peek(V, 276)) + 1))));\n    poke(V, t4, 277);\n    t5 = f_mode_add(V, M, mq, peek(V, 277), p5, p6, (p8 / sqrt(abs(peek(V, 276)))), cos((peek(V, 276) * 0.5)), cos((peek(V, 276) * 2.2)));\n    t6 = f_mode_add(V, M, mq, (peek(V, 277) * 1.004), p5, p6, (p8 / sqrt(abs(peek(V, 276)))), sin((peek(V, 276) * 0.5)), sin((peek(V, 276) * 2.2)));\n    t7 = (peek(V, 276) + 1);\n    poke(V, t7, 276);\n    r = t7;\n  }\n  return r;\n}\n\nf_plate_modes(V, M, mq, p0, p1, p2, p3, p4, p5, p6, p7, p8, p9) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0;\n  r = 0;\n  poke(V, 0, 278);\n  poke(V, 1, 279);\n  t1 = min(1048576, trunc(14));\n  for (t2 = 0; t2 < t1; t2 += 1) {\n    poke(V, 1, 280);\n    t3 = min(1048576, trunc(14));\n    for (t4 = 0; t4 < t3; t4 += 1) {\n      t5 = trunc(peek(V, 94) + (peek(V, 278) * 3) + 0.00001);\n      t6 = ((0.5 * 3.141592653589793) * sqrt(abs(((((p3 * pow((peek(V, 279) / p0), 4)) + ((2 * p5) * pow(((peek(V, 279) * peek(V, 280)) / (p0 * p1)), 2))) + (p4 * pow((peek(V, 280) / p1), 4))) / p2))));\n      poke(M, t6, t5);\n      t7 = trunc(peek(V, 94) + ((peek(V, 278) * 3) + 1) + 0.00001);\n      t8 = peek(V, 279);\n      poke(M, t8, t7);\n      t9 = trunc(peek(V, 94) + ((peek(V, 278) * 3) + 2) + 0.00001);\n      t10 = peek(V, 280);\n      poke(M, t10, t9);\n      t11 = (peek(V, 278) + 1);\n      poke(V, t11, 278);\n      t12 = (peek(V, 280) + 1);\n      poke(V, t12, 280);\n    }\n    t13 = (peek(V, 279) + 1);\n    poke(V, t13, 279);\n  }\n  poke(V, 0, 281);\n  t14 = min(1048576, trunc(p8));\n  r = 0;\n  for (t15 = 0; t15 < t14; t15 += 1) {\n    t16 = pow(10, 30);\n    poke(V, t16, 282);\n    poke(V, (-1), 283);\n    poke(V, 0, 284);\n    t17 = min(1048576, trunc(196));\n    for (t18 = 0; t18 < t17; t18 += 1) {\n      if ((abs((peek(M, trunc(peek(V, 94) + (peek(V, 284) * 3) + 0.00001)) < peek(V, 282) ? 1 : 0)) >= 0.00001)) {\n        t19 = peek(M, trunc(peek(V, 94) + (peek(V, 284) * 3) + 0.00001));\n        poke(V, t19, 282);\n        t20 = peek(V, 284);\n        poke(V, t20, 283);\n      }\n      t21 = (peek(V, 284) + 1);\n      poke(V, t21, 284);\n    }\n    if ((abs((peek(V, 283) >= 0 ? 1 : 0)) >= 0.00001)) {\n      t22 = peek(M, trunc(peek(V, 94) + ((peek(V, 283) * 3) + 1) + 0.00001));\n      poke(V, t22, 279);\n      t23 = peek(M, trunc(peek(V, 94) + ((peek(V, 283) * 3) + 2) + 0.00001));\n      poke(V, t23, 280);\n      t24 = trunc(peek(V, 94) + (peek(V, 283) * 3) + 0.00001);\n      t25 = pow(10, 31);\n      poke(M, t25, t24);\n      if ((abs((abs(peek(V, 281) - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n        t26 = peek(V, 282);\n        poke(V, t26, 281);\n      }\n      t27 = ((sin(((peek(V, 279) * 3.141592653589793) * 0.37)) * sin(((peek(V, 280) * 3.141592653589793) * 0.43))) * pow((peek(V, 282) / peek(V, 281)), (-p9)));\n      poke(V, t27, 285);\n      t28 = f_mode_add(V, M, mq, peek(V, 282), p6, p7, peek(V, 285), (sin(((peek(V, 279) * 3.141592653589793) * 0.21)) * sin(((peek(V, 280) * 3.141592653589793) * 0.64))), (sin(((peek(V, 279) * 3.141592653589793) * 0.74)) * sin(((peek(V, 280) * 3.141592653589793) * 0.27))));\n      r = t28;\n    }\n    else {\n      r = 0;\n    }\n  }\n  return r;\n}\n\nf_besj(V, M, mq, p0, p1) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0;\n  r = 0;\n  t1 = (0.5 * p1);\n  poke(V, t1, 293);\n  poke(V, 1, 294);\n  poke(V, 1, 295);\n  t2 = min(1048576, trunc(p0));\n  for (t3 = 0; t3 < t2; t3 += 1) {\n    t4 = (peek(V, 293) / peek(V, 295));\n    t5 = (peek(V, 294) * t4);\n    poke(V, t5, 294);\n    t6 = (peek(V, 295) + 1);\n    poke(V, t6, 295);\n  }\n  t7 = peek(V, 294);\n  poke(V, t7, 296);\n  poke(V, 1, 295);\n  t8 = min(1048576, trunc(40));\n  for (t9 = 0; t9 < t8; t9 += 1) {\n    t10 = (((-peek(V, 293)) * peek(V, 293)) / (peek(V, 295) * (peek(V, 295) + p0)));\n    t11 = (peek(V, 294) * t10);\n    poke(V, t11, 294);\n    t12 = peek(V, 294);\n    t13 = (peek(V, 296) + t12);\n    poke(V, t13, 296);\n    t14 = (peek(V, 295) + 1);\n    poke(V, t14, 295);\n  }\n  r = peek(V, 296);\n  return r;\n}\n\nf_membrane_modes(V, M, mq, p0, p1, p2, p3, p4, p5, p6, p7) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0;\n  r = 0;\n  poke(V, 0, 286);\n  poke(V, 0, 287);\n  t1 = min(1048576, trunc(min(p5, 24)));\n  r = 0;\n  for (t2 = 0; t2 < t1; t2 += 1) {\n    t3 = peek(M, trunc(peek(V, 95) + (peek(V, 286) * 2) + 0.00001));\n    poke(V, t3, 288);\n    t4 = peek(M, trunc(peek(V, 95) + ((peek(V, 286) * 2) + 1) + 0.00001));\n    poke(V, t4, 289);\n    t5 = (((2 * peek(V, 101)) * p0) / peek(V, 288));\n    poke(V, t5, 290);\n    t6 = ((peek(V, 288) / ((2 * 3.141592653589793) * p0)) * sqrt(abs((p1 / (p2 + peek(V, 290))))));\n    poke(V, t6, 291);\n    if ((abs((abs(peek(V, 287) - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n      t7 = peek(V, 291);\n      poke(V, t7, 287);\n    }\n    t8 = (p3 + ((p7 * peek(V, 290)) / (p2 + peek(V, 290))));\n    poke(V, t8, 292);\n    t9 = f_besj(V, M, mq, peek(V, 289), (peek(V, 288) * 0.3));\n    t10 = ((t9 * cos((peek(V, 289) * 0.8))) * pow((peek(V, 291) / peek(V, 287)), (-p6)));\n    poke(V, t10, 297);\n    t11 = peek(V, 291);\n    t12 = peek(V, 292);\n    t13 = p4;\n    t14 = peek(V, 297);\n    t15 = f_besj(V, M, mq, peek(V, 289), (peek(V, 288) * 0.55));\n    t16 = (t15 * cos((peek(V, 289) * 0.2)));\n    t17 = f_besj(V, M, mq, peek(V, 289), (peek(V, 288) * 0.45));\n    t18 = f_mode_add(V, M, mq, t11, t12, t13, t14, t16, (t17 * cos((peek(V, 289) * 2))));\n    if ((abs((peek(V, 289) > 0 ? 1 : 0)) >= 0.00001)) {\n      t19 = (peek(V, 291) * 1.002);\n      t20 = peek(V, 292);\n      t21 = p4;\n      t22 = f_besj(V, M, mq, peek(V, 289), (peek(V, 288) * 0.3));\n      t23 = ((t22 * sin((peek(V, 289) * 0.8))) * pow((peek(V, 291) / peek(V, 287)), (-p6)));\n      t24 = f_besj(V, M, mq, peek(V, 289), (peek(V, 288) * 0.55));\n      t25 = (t24 * sin((peek(V, 289) * 0.2)));\n      t26 = f_besj(V, M, mq, peek(V, 289), (peek(V, 288) * 0.45));\n      t27 = f_mode_add(V, M, mq, t19, t20, t21, t23, t25, (t26 * sin((peek(V, 289) * 2))));\n    }\n    t28 = (peek(V, 286) + 1);\n    poke(V, t28, 286);\n    r = t28;\n  }\n  return r;\n}\n\nf_setup_material(V, M, mq) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0; t39 = 0; t40 = 0; t41 = 0; t42 = 0; t43 = 0; t44 = 0; t45 = 0; t46 = 0; t47 = 0; t48 = 0; t49 = 0; t50 = 0; t51 = 0; t52 = 0; t53 = 0; t54 = 0; t55 = 0; t56 = 0; t57 = 0; t58 = 0; t59 = 0; t60 = 0; t61 = 0; t62 = 0; t63 = 0; t64 = 0; t65 = 0; t66 = 0; t67 = 0; t68 = 0; t69 = 0; t70 = 0; t71 = 0; t72 = 0; t73 = 0; t74 = 0; t75 = 0; t76 = 0; t77 = 0; t78 = 0; t79 = 0; t80 = 0; t81 = 0; t82 = 0; t83 = 0; t84 = 0; t85 = 0; t86 = 0; t87 = 0; t88 = 0; t89 = 0; t90 = 0; t91 = 0; t92 = 0; t93 = 0; t94 = 0; t95 = 0; t96 = 0; t97 = 0; t98 = 0; t99 = 0; t100 = 0; t101 = 0; t102 = 0; t103 = 0; t104 = 0; t105 = 0; t106 = 0; t107 = 0; t108 = 0; t109 = 0; t110 = 0; t111 = 0; t112 = 0; t113 = 0; t114 = 0; t115 = 0; t116 = 0; t117 = 0; t118 = 0; t119 = 0; t120 = 0; t121 = 0; t122 = 0; t123 = 0; t124 = 0; t125 = 0; t126 = 0; t127 = 0; t128 = 0; t129 = 0; t130 = 0; t131 = 0; t132 = 0; t133 = 0; t134 = 0; t135 = 0; t136 = 0; t137 = 0; t138 = 0; t139 = 0; t140 = 0; t141 = 0; t142 = 0; t143 = 0; t144 = 0; t145 = 0; t146 = 0; t147 = 0; t148 = 0; t149 = 0; t150 = 0; t151 = 0; t152 = 0; t153 = 0; t154 = 0; t155 = 0; t156 = 0; t157 = 0; t158 = 0; t159 = 0; t160 = 0; t161 = 0; t162 = 0; t163 = 0; t164 = 0; t165 = 0; t166 = 0; t167 = 0; t168 = 0; t169 = 0; t170 = 0; t171 = 0; t172 = 0; t173 = 0; t174 = 0; t175 = 0; t176 = 0; t177 = 0; t178 = 0; t179 = 0; t180 = 0; t181 = 0; t182 = 0; t183 = 0; t184 = 0; t185 = 0; t186 = 0; t187 = 0; t188 = 0; t189 = 0; t190 = 0; t191 = 0; t192 = 0; t193 = 0; t194 = 0; t195 = 0; t196 = 0; t197 = 0; t198 = 0; t199 = 0; t200 = 0; t201 = 0; t202 = 0; t203 = 0; t204 = 0; t205 = 0; t206 = 0; t207 = 0; t208 = 0; t209 = 0; t210 = 0; t211 = 0; t212 = 0; t213 = 0; t214 = 0; t215 = 0; t216 = 0; t217 = 0; t218 = 0; t219 = 0; t220 = 0; t221 = 0; t222 = 0; t223 = 0; t224 = 0;\n  r = 0;\n  poke(V, 0, 139);\n  poke(V, 0, 140);\n  poke(V, 0, 141);\n  poke(V, 0, 142);\n  poke(V, 4, 143);\n  poke(V, 0, 144);\n  poke(V, 0, 145);\n  poke(V, 0, 146);\n  poke(V, 0, 147);\n  poke(V, 0, 148);\n  poke(V, 0, 149);\n  poke(V, 0, 150);\n  poke(V, 0, 151);\n  poke(V, 0, 152);\n  poke(V, 0, 153);\n  poke(V, 0, 154);\n  poke(V, 0, 155);\n  poke(V, 0, 156);\n  poke(V, 0, 157);\n  poke(V, 0, 158);\n  poke(V, 1000, 159);\n  poke(V, 1, 160);\n  poke(V, 0, 161);\n  poke(V, 0, 162);\n  poke(V, 0, 163);\n  poke(V, 0, 164);\n  poke(V, 0, 165);\n  poke(V, 0, 166);\n  poke(V, 30, 167);\n  poke(V, 16000, 168);\n  poke(V, 0, 169);\n  poke(V, 20, 170);\n  poke(V, 20, 171);\n  poke(V, 20000, 172);\n  poke(V, 0, 173);\n  if ((abs((abs(peek(V, 129) - 0) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t1 = f_wire_add(V, M, mq, 3, 0.004, 1500, 7850, (200 * pow(10, 9)), 0.0015, 4, 48, peek(V, 132), 1, 0.95, 0.35);\n    t2 = f_wire_add(V, M, mq, 3.4, 0.004, 1500, 7850, (200 * pow(10, 9)), 0.0015, 4, 48, peek(V, 132), 1, 0.35, 0.95);\n    poke(V, 0, 229);\n    t3 = min(1048576, trunc(8));\n    for (t4 = 0; t4 < t3; t4 += 1) {\n      t5 = (0.055 + ((0.03 * peek(V, 229)) / 7));\n      poke(V, t5, 230);\n      t6 = ((22.373 / (((2 * 3.141592653589793) * peek(V, 230)) * peek(V, 230))) * sqrt(abs((((200 * pow(10, 9)) * pow(0.0025, 2)) / (16 * 7850)))));\n      poke(V, t6, 231);\n      t7 = f_mode_add(V, M, mq, peek(V, 231), 0.012, 0.5, 1, sin(((peek(V, 229) * 2.4) + 0.3)), cos(((peek(V, 229) * 1.7) + 0.5)));\n      t8 = f_mode_add(V, M, mq, (peek(V, 231) * 2.757), 0.012, 0.5, 0.6, sin(((peek(V, 229) * 1.3) + 1.1)), cos(((peek(V, 229) * 2.9) + 0.2)));\n      t9 = f_mode_add(V, M, mq, (peek(V, 231) * 5.404), 0.012, 0.5, 0.35, sin(((peek(V, 229) * 3.1) + 0.7)), cos(((peek(V, 229) * 0.9) + 1.3)));\n      t10 = (peek(V, 229) + 1);\n      poke(V, t10, 229);\n    }\n    t11 = f_t60e(V, M, mq, 200, 0.003, 1.2);\n    t12 = f_t60e(V, M, mq, 4000, 0.003, 1.2);\n    t13 = f_fdn_setup(V, M, mq, 0.04, t11, t12, 3, 1);\n    poke(V, 1, 146);\n    poke(V, 0.3, 145);\n    poke(V, 1, 144);\n    poke(V, 0.3, 148);\n    poke(V, 0.55, 152);\n    poke(V, 0.2, 151);\n    poke(V, 0.25, 150);\n    poke(V, 1, 158);\n    poke(V, 1, 157);\n    poke(V, 0.5, 156);\n    poke(V, 1, 154);\n    poke(V, 0.5, 153);\n    poke(V, 1500, 159);\n    poke(V, 1.2, 160);\n    poke(V, 9000, 169);\n    t14 = peek(M, trunc(peek(V, 109) + 0.00001));\n    poke(V, t14, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 1) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t15 = (((9 * pow(10, 9)) * pow(0.05, 3)) / (12 * (1 - pow(0.33, 2))));\n    poke(V, t15, 258);\n    t16 = pow((peek(V, 258) / (917 * 0.05)), 0.25);\n    poke(V, t16, 259);\n    poke(V, 70, 260);\n    t17 = (peek(V, 260) / ((2 * peek(V, 259)) * sqrt(abs(((2 * 3.141592653589793) * 250)))));\n    t18 = (peek(V, 260) / ((2 * peek(V, 259)) * sqrt(abs(((2 * 3.141592653589793) * 4000)))));\n    t19 = f_t60e(V, M, mq, 250, 0.001, 1.8);\n    t20 = f_t60e(V, M, mq, 4000, 0.001, 1.8);\n    t21 = f_chirp_add(V, M, mq, 250, t17, 4000, t18, t19, t20, 96, 1, 1, 0.15);\n    poke(V, 96, 260);\n    t22 = (peek(V, 260) / ((2 * peek(V, 259)) * sqrt(abs(((2 * 3.141592653589793) * 250)))));\n    t23 = (peek(V, 260) / ((2 * peek(V, 259)) * sqrt(abs(((2 * 3.141592653589793) * 4000)))));\n    t24 = f_t60e(V, M, mq, 250, 0.001, 1.8);\n    t25 = f_t60e(V, M, mq, 4000, 0.001, 1.8);\n    t26 = f_chirp_add(V, M, mq, 250, t22, 4000, t23, t24, t25, 96, 1, 0.15, 1);\n    t27 = f_t60e(V, M, mq, 200, 0.004, 2.5);\n    t28 = f_t60e(V, M, mq, 4000, 0.004, 2.5);\n    t29 = f_fdn_setup(V, M, mq, 0.25, t27, t28, 4, 1);\n    poke(V, 1, 146);\n    poke(V, 1, 144);\n    poke(V, 0.25, 148);\n    poke(V, 0.7, 152);\n    poke(V, 0.3, 150);\n    poke(V, 4500, 169);\n    poke(V, 9000, 172);\n    poke(V, 60, 167);\n    t30 = peek(M, trunc(peek(V, 109) + 1 + 0.00001));\n    poke(V, t30, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 2) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t31 = f_wire_add(V, M, mq, 25, 0.0025, 2000, 7850, (200 * pow(10, 9)), 0.0004, 15, 96, peek(V, 132), 1, 1, 0.2);\n    t32 = f_wire_add(V, M, mq, 31, 0.0025, 2000, 7850, (200 * pow(10, 9)), 0.0004, 15, 96, peek(V, 132), 1, 0.2, 1);\n    t33 = f_t60e(V, M, mq, 200, 0.002, 2);\n    t34 = f_t60e(V, M, mq, 4000, 0.002, 2);\n    t35 = f_fdn_setup(V, M, mq, 0.03, t33, t34, 2, 1);\n    poke(V, 1, 146);\n    poke(V, 0.5, 144);\n    poke(V, 0.15, 148);\n    poke(V, 0.85, 152);\n    poke(V, 0.15, 150);\n    poke(V, 9000, 169);\n    t36 = peek(M, trunc(peek(V, 109) + 2 + 0.00001));\n    poke(V, t36, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 3) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    poke(V, 0.4, 261);\n    poke(V, 0.003, 262);\n    t37 = (((110 * pow(10, 9)) * pow(peek(V, 262), 3)) / (12 * (1 - pow(0.34, 2))));\n    poke(V, t37, 258);\n    t38 = (8600 * peek(V, 262));\n    poke(V, t38, 263);\n    t39 = (sqrt(abs((peek(V, 258) / peek(V, 263)))) / (((2 * 3.141592653589793) * peek(V, 261)) * peek(V, 261)));\n    poke(V, t39, 259);\n    poke(V, 0, 229);\n    t40 = min(1048576, trunc(12));\n    for (t41 = 0; t41 < t40; t41 += 1) {\n      t42 = ((abs((abs(peek(V, 229) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 5.253 : ((abs((abs(peek(V, 229) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 9.084 : ((abs((abs(peek(V, 229) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 12.23 : ((abs((abs(peek(V, 229) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 20.52 : ((abs((abs(peek(V, 229) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? 21.6 : ((abs((abs(peek(V, 229) - 5) < 0.00001 ? 1 : 0)) >= 0.00001) ? 33.06 : ((abs((abs(peek(V, 229) - 6) < 0.00001 ? 1 : 0)) >= 0.00001) ? 35.25 : ((abs((abs(peek(V, 229) - 7) < 0.00001 ? 1 : 0)) >= 0.00001) ? 38.55 : ((abs((abs(peek(V, 229) - 8) < 0.00001 ? 1 : 0)) >= 0.00001) ? 46.2 : ((abs((abs(peek(V, 229) - 9) < 0.00001 ? 1 : 0)) >= 0.00001) ? 52.91 : ((abs((abs(peek(V, 229) - 10) < 0.00001 ? 1 : 0)) >= 0.00001) ? 59.86 : 61)))))))))));\n      poke(V, t42, 264);\n      t43 = ((abs((abs(peek(V, 229) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 2 : ((abs((abs(peek(V, 229) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0 : ((abs((abs(peek(V, 229) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 3 : ((abs((abs(peek(V, 229) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 1 : ((abs((abs(peek(V, 229) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? 4 : ((abs((abs(peek(V, 229) - 5) < 0.00001 ? 1 : 0)) >= 0.00001) ? 5 : ((abs((abs(peek(V, 229) - 6) < 0.00001 ? 1 : 0)) >= 0.00001) ? 2 : ((abs((abs(peek(V, 229) - 7) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0 : ((abs((abs(peek(V, 229) - 8) < 0.00001 ? 1 : 0)) >= 0.00001) ? 6 : ((abs((abs(peek(V, 229) - 9) < 0.00001 ? 1 : 0)) >= 0.00001) ? 3 : ((abs((abs(peek(V, 229) - 10) < 0.00001 ? 1 : 0)) >= 0.00001) ? 1 : 7)))))))))));\n      poke(V, t43, 265);\n      t44 = f_mode_add(V, M, mq, (peek(V, 259) * peek(V, 264)), 0.0004, 40, (cos((peek(V, 265) * 1.1)) / sqrt(abs((1 + peek(V, 229))))), cos((peek(V, 265) * 0.4)), cos((peek(V, 265) * 2.1)));\n      if ((abs((peek(V, 265) > 0 ? 1 : 0)) >= 0.00001)) {\n        t45 = f_mode_add(V, M, mq, ((peek(V, 259) * peek(V, 264)) * 1.003), 0.0004, 40, (sin((peek(V, 265) * 1.1)) / sqrt(abs((1 + peek(V, 229))))), sin((peek(V, 265) * 0.4)), sin((peek(V, 265) * 2.1)));\n      }\n      t46 = (peek(V, 229) + 1);\n      poke(V, t46, 229);\n    }\n    t47 = f_plate_density(V, M, mq, ((3.141592653589793 * peek(V, 261)) * peek(V, 261)), peek(V, 263), peek(V, 258));\n    t48 = f_t60e(V, M, mq, 200, 0.0004, 40);\n    t49 = f_t60e(V, M, mq, 4000, 0.0004, 40);\n    t50 = f_fdn_setup(V, M, mq, t47, t48, t49, 4, 1);\n    poke(V, 1, 145);\n    poke(V, 1, 144);\n    poke(V, 0.2, 147);\n    poke(V, 0.3, 151);\n    poke(V, 0.7, 150);\n    poke(V, 1, 165);\n    poke(V, 0.3, 166);\n    t51 = peek(M, trunc(peek(V, 109) + 3 + 0.00001));\n    poke(V, t51, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 4) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t52 = f_tube_add(V, M, mq, 1.5, 0.026, 2, 1, 1, 1, 0.25);\n    t53 = f_tube_add(V, M, mq, 1.62, 0.026, 2, 1, 1, 0.25, 1);\n    t54 = f_ring_modes(V, M, mq, 0.03, 0.0035, (3 * pow(10, 9)), 1400, 0.4, 0.03, 0.5, 5, 0.5);\n    poke(V, 1, 146);\n    poke(V, 1, 145);\n    poke(V, 0.8, 152);\n    poke(V, 0.2, 151);\n    t55 = peek(M, trunc(peek(V, 109) + 4 + 0.00001));\n    poke(V, t55, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 5) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t56 = (((70 * pow(10, 9)) * pow(0.005, 3)) / (12 * (1 - pow(0.22, 2))));\n    poke(V, t56, 258);\n    t57 = (2500 * 0.005);\n    poke(V, t57, 263);\n    t58 = f_plate_modes(V, M, mq, 0.8, 0.6, peek(V, 263), peek(V, 258), peek(V, 258), peek(V, 258), 0.0008, 6, 32, 0.3);\n    t59 = f_plate_density(V, M, mq, 0.48, peek(V, 263), peek(V, 258));\n    t60 = f_t60e(V, M, mq, 200, 0.0008, 6);\n    t61 = f_t60e(V, M, mq, 4000, 0.0008, 6);\n    t62 = f_fdn_setup(V, M, mq, t59, t60, t61, 4.5, 1);\n    poke(V, 1, 145);\n    poke(V, 1, 144);\n    poke(V, 0.4, 151);\n    poke(V, 0.6, 150);\n    poke(V, 120, 167);\n    t63 = peek(M, trunc(peek(V, 109) + 5 + 0.00001));\n    poke(V, t63, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 6) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t64 = (((55 * pow(10, 9)) * pow(0.02, 3)) / (12 * (1 - pow(0.26, 2))));\n    poke(V, t64, 258);\n    t65 = (2700 * 0.02);\n    poke(V, t65, 263);\n    t66 = f_plate_modes(V, M, mq, 1, 0.6, peek(V, 263), peek(V, 258), peek(V, 258), peek(V, 258), 0.003, 2.5, 32, 0.3);\n    t67 = f_plate_density(V, M, mq, 0.6, peek(V, 263), peek(V, 258));\n    t68 = f_t60e(V, M, mq, 200, 0.003, 2.5);\n    t69 = f_t60e(V, M, mq, 4000, 0.003, 2.5);\n    t70 = f_fdn_setup(V, M, mq, t67, t68, t69, 3, 1);\n    poke(V, 1, 145);\n    poke(V, 1, 144);\n    poke(V, 0.65, 151);\n    poke(V, 0.35, 150);\n    t71 = peek(M, trunc(peek(V, 109) + 6 + 0.00001));\n    poke(V, t71, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 7) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t72 = (((207 * pow(10, 9)) * pow(0.0008, 3)) / (12 * (1 - pow(0.29, 2))));\n    poke(V, t72, 258);\n    t73 = (7850 * 0.0008);\n    poke(V, t73, 263);\n    poke(V, 340, 142);\n    t74 = f_plate_modes(V, M, mq, 1.1, 0.8, peek(V, 263), peek(V, 258), peek(V, 258), peek(V, 258), 0.003, 2.5, 16, 0.4);\n    poke(V, 0, 142);\n    t75 = f_plate_density(V, M, mq, 0.88, peek(V, 263), peek(V, 258));\n    t76 = f_t60e(V, M, mq, 200, 0.003, 2.5);\n    t77 = f_t60e(V, M, mq, 4000, 0.003, 2.5);\n    t78 = f_fdn_setup(V, M, mq, t75, t76, t77, 4, 1);\n    poke(V, 340, 170);\n    poke(V, 1, 145);\n    poke(V, 1, 144);\n    poke(V, 0.25, 151);\n    poke(V, 0.75, 150);\n    poke(V, 0.4, 158);\n    poke(V, 1, 156);\n    poke(V, 0.6, 153);\n    poke(V, 2500, 159);\n    poke(V, 4, 160);\n    t79 = peek(M, trunc(peek(V, 109) + 7 + 0.00001));\n    poke(V, t79, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 8) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t80 = f_membrane_modes(V, M, mq, 0.2, 1500, 1.08, 0.06, 0.8, 20, 0.5, 0.2);\n    t81 = f_fdn_setup(V, M, mq, 0.02, 0.25, 0.05, 1.5, 1);\n    poke(V, 1, 145);\n    poke(V, 1, 144);\n    poke(V, 0.8, 151);\n    poke(V, 0.2, 150);\n    poke(V, 0.5, 166);\n    poke(V, 6000, 172);\n    t82 = peek(M, trunc(peek(V, 109) + 8 + 0.00001));\n    poke(V, t82, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 9) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    poke(V, 0.0095, 261);\n    t83 = ((3.141592653589793 * peek(V, 261)) * peek(V, 261));\n    poke(V, t83, 298);\n    t84 = (0.08 + (1.46 * peek(V, 261)));\n    poke(V, t84, 230);\n    t85 = f_mode_add(V, M, mq, ((peek(V, 100) / (2 * 3.141592653589793)) * sqrt(abs((peek(V, 298) / (0.00075 * peek(V, 230)))))), (1 / 35), 3, 1, 1, 1);\n    t86 = f_mode_add(V, M, mq, (peek(V, 100) / (2 * 0.2)), (1 / 60), 2, 0.25, 0.7, (-0.4));\n    t87 = f_mode_add(V, M, mq, ((2 * peek(V, 100)) / (2 * 0.2)), (1 / 60), 2, 0.15, (-0.3), 0.8);\n    t88 = f_mode_add(V, M, mq, ((1.8412 * peek(V, 100)) / ((2 * 3.141592653589793) * 0.037)), (1 / 80), 2, 0.15, 0.6, 0.5);\n    t89 = f_ring_modes(V, M, mq, 0.037, 0.004, (70 * pow(10, 9)), 2500, 0.22, 0.0008, 3, 6, 0.5);\n    t90 = f_t60e(V, M, mq, 200, 0.0008, 2);\n    t91 = f_t60e(V, M, mq, 4000, 0.0008, 2);\n    t92 = f_fdn_setup(V, M, mq, 0.006, t90, t91, 3, 1);\n    poke(V, 1, 145);\n    poke(V, 1, 144);\n    poke(V, 0.85, 151);\n    poke(V, 0.15, 150);\n    t93 = peek(M, trunc(peek(V, 109) + 9 + 0.00001));\n    poke(V, t93, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 10) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    poke(V, 0, 229);\n    t94 = min(1048576, trunc(24));\n    for (t95 = 0; t95 < t94; t95 += 1) {\n      t96 = (36 + peek(V, 229));\n      poke(V, t96, 299);\n      t97 = (440 * pow(2, ((peek(V, 299) - 69) / 12)));\n      poke(V, t97, 300);\n      t98 = min(1.9, (0.62 * pow(2, (((60 - peek(V, 299)) * 0.85) / 12))));\n      poke(V, t98, 230);\n      t99 = ((abs((peek(V, 299) < 48 ? 1 : 0)) >= 0.00001) ? 0.0012 : 0.001);\n      poke(V, t99, 301);\n      t100 = ((((pow(3.141592653589793, 3) * 200) * pow(10, 9)) * pow(peek(V, 301), 4)) / (((64 * 800) * peek(V, 230)) * peek(V, 230)));\n      poke(V, t100, 302);\n      t101 = f_string_add(V, M, mq, (peek(V, 300) / sqrt(abs((1 + peek(V, 302))))), peek(V, 302), 0.00012, 18, 4, 1, 1, (0.5 + (0.45 * sin((peek(V, 229) * 2.4)))), (0.5 - (0.45 * sin((peek(V, 229) * 2.4)))));\n      t102 = (peek(V, 229) + 1);\n      poke(V, t102, 229);\n    }\n    t103 = (((11 * pow(10, 9)) * pow(0.009, 3)) / (12 * (1 - pow(0.3, 2))));\n    poke(V, t103, 258);\n    t104 = (440 * 0.009);\n    poke(V, t104, 263);\n    t105 = f_plate_density(V, M, mq, 1.8, peek(V, 263), peek(V, 258));\n    t106 = f_t60e(V, M, mq, 200, 0.012, 1.2);\n    t107 = f_t60e(V, M, mq, 4000, 0.012, 1.2);\n    t108 = f_fdn_setup(V, M, mq, t105, t106, t107, 3, 1);\n    poke(V, 1, 146);\n    poke(V, 0.5, 144);\n    poke(V, 0.35, 148);\n    poke(V, 0.75, 152);\n    poke(V, 0.25, 150);\n    t109 = peek(M, trunc(peek(V, 109) + 10 + 0.00001));\n    poke(V, t109, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 11) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    poke(V, 0, 229);\n    t110 = min(1048576, trunc(6));\n    for (t111 = 0; t111 < t110; t111 += 1) {\n      t112 = ((abs((abs(peek(V, 229) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 40 : ((abs((abs(peek(V, 229) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 45 : ((abs((abs(peek(V, 229) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 50 : ((abs((abs(peek(V, 229) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 55 : ((abs((abs(peek(V, 229) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? 59 : 64)))));\n      poke(V, t112, 299);\n      t113 = ((abs((abs(peek(V, 229) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.00046 : ((abs((abs(peek(V, 229) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.00043 : ((abs((abs(peek(V, 229) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.0004 : ((abs((abs(peek(V, 229) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.00043 : ((abs((abs(peek(V, 229) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.00033 : 0.00025)))));\n      poke(V, t113, 301);\n      t114 = (440 * pow(2, ((peek(V, 299) - 69) / 12)));\n      poke(V, t114, 300);\n      t115 = ((((pow(3.141592653589793, 3) * 200) * pow(10, 9)) * pow(peek(V, 301), 4)) / (((64 * 110) * 0.648) * 0.648));\n      poke(V, t115, 302);\n      t116 = f_string_add(V, M, mq, (peek(V, 300) / sqrt(abs((1 + peek(V, 302))))), peek(V, 302), 0.0003, 6, 3, 1, 1, (0.5 + ((0.4 * (peek(V, 229) - 2.5)) / 2.5)), (0.5 - ((0.4 * (peek(V, 229) - 2.5)) / 2.5)));\n      t117 = (peek(V, 229) + 1);\n      poke(V, t117, 229);\n    }\n    poke(V, 0, 229);\n    t118 = min(1048576, trunc(12));\n    for (t119 = 0; t119 < t118; t119 += 1) {\n      t120 = ((abs((abs(peek(V, 229) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 98 : ((abs((abs(peek(V, 229) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 204 : ((abs((abs(peek(V, 229) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 226 : ((abs((abs(peek(V, 229) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 381 : ((abs((abs(peek(V, 229) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? 437 : ((abs((abs(peek(V, 229) - 5) < 0.00001 ? 1 : 0)) >= 0.00001) ? 552 : ((abs((abs(peek(V, 229) - 6) < 0.00001 ? 1 : 0)) >= 0.00001) ? 650 : ((abs((abs(peek(V, 229) - 7) < 0.00001 ? 1 : 0)) >= 0.00001) ? 780 : ((abs((abs(peek(V, 229) - 8) < 0.00001 ? 1 : 0)) >= 0.00001) ? 920 : ((abs((abs(peek(V, 229) - 9) < 0.00001 ? 1 : 0)) >= 0.00001) ? 1100 : ((abs((abs(peek(V, 229) - 10) < 0.00001 ? 1 : 0)) >= 0.00001) ? 1450 : 2000)))))))))));\n      poke(V, t120, 231);\n      t121 = ((abs((abs(peek(V, 229) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 20 : ((abs((abs(peek(V, 229) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 30 : ((abs((abs(peek(V, 229) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 25 : ((abs((abs(peek(V, 229) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 30 : ((abs((abs(peek(V, 229) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? 35 : ((abs((abs(peek(V, 229) - 5) < 0.00001 ? 1 : 0)) >= 0.00001) ? 35 : ((abs((abs(peek(V, 229) - 6) < 0.00001 ? 1 : 0)) >= 0.00001) ? 40 : ((abs((abs(peek(V, 229) - 7) < 0.00001 ? 1 : 0)) >= 0.00001) ? 40 : ((abs((abs(peek(V, 229) - 8) < 0.00001 ? 1 : 0)) >= 0.00001) ? 40 : ((abs((abs(peek(V, 229) - 9) < 0.00001 ? 1 : 0)) >= 0.00001) ? 45 : ((abs((abs(peek(V, 229) - 10) < 0.00001 ? 1 : 0)) >= 0.00001) ? 40 : 35)))))))))));\n      poke(V, t121, 259);\n      t122 = f_mode_add(V, M, mq, peek(V, 231), (1 / peek(V, 259)), 1, (1 / sqrt(abs((1 + peek(V, 229))))), sin(((peek(V, 229) * 2.1) + 0.4)), cos(((peek(V, 229) * 1.3) + 0.9)));\n      t123 = (peek(V, 229) + 1);\n      poke(V, t123, 229);\n    }\n    t124 = f_fdn_setup(V, M, mq, 0.04, 0.5, 0.15, 2, 1);\n    poke(V, 1, 146);\n    poke(V, 0.4, 145);\n    poke(V, 0.3, 144);\n    poke(V, 0.6, 149);\n    poke(V, 0.1, 148);\n    poke(V, 0.45, 152);\n    poke(V, 0.45, 151);\n    poke(V, 0.1, 150);\n    t125 = peek(M, trunc(peek(V, 109) + 11 + 0.00001));\n    poke(V, t125, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 12) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    poke(V, 0, 229);\n    t126 = min(1048576, trunc(4));\n    for (t127 = 0; t127 < t126; t127 += 1) {\n      t128 = ((abs((abs(peek(V, 229) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 55 : ((abs((abs(peek(V, 229) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 62 : ((abs((abs(peek(V, 229) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 69 : 76)));\n      poke(V, t128, 299);\n      t129 = (440 * pow(2, ((peek(V, 299) - 69) / 12)));\n      poke(V, t129, 300);\n      t130 = ((abs((abs(peek(V, 229) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.00018 : ((abs((abs(peek(V, 229) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.00011 : ((abs((abs(peek(V, 229) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.00007 : 0.000055)));\n      poke(V, t130, 302);\n      t131 = f_string_add(V, M, mq, (peek(V, 300) / sqrt(abs((1 + peek(V, 302))))), peek(V, 302), 0.0015, 3, 3, 1, 1, (0.5 + ((0.35 * (peek(V, 229) - 1.5)) / 1.5)), (0.5 - ((0.35 * (peek(V, 229) - 1.5)) / 1.5)));\n      t132 = (peek(V, 229) + 1);\n      poke(V, t132, 229);\n    }\n    poke(V, 0, 229);\n    t133 = min(1048576, trunc(12));\n    for (t134 = 0; t134 < t133; t134 += 1) {\n      t135 = ((abs((abs(peek(V, 229) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 275 : ((abs((abs(peek(V, 229) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 405 : ((abs((abs(peek(V, 229) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 460 : ((abs((abs(peek(V, 229) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 550 : ((abs((abs(peek(V, 229) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? 700 : ((abs((abs(peek(V, 229) - 5) < 0.00001 ? 1 : 0)) >= 0.00001) ? 850 : ((abs((abs(peek(V, 229) - 6) < 0.00001 ? 1 : 0)) >= 0.00001) ? 1000 : ((abs((abs(peek(V, 229) - 7) < 0.00001 ? 1 : 0)) >= 0.00001) ? 1300 : ((abs((abs(peek(V, 229) - 8) < 0.00001 ? 1 : 0)) >= 0.00001) ? 2100 : ((abs((abs(peek(V, 229) - 9) < 0.00001 ? 1 : 0)) >= 0.00001) ? 2450 : ((abs((abs(peek(V, 229) - 10) < 0.00001 ? 1 : 0)) >= 0.00001) ? 2800 : 3300)))))))))));\n      poke(V, t135, 231);\n      t136 = ((abs((abs(peek(V, 229) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 18 : ((abs((abs(peek(V, 229) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 25 : ((abs((abs(peek(V, 229) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 30 : ((abs((abs(peek(V, 229) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 30 : ((abs((abs(peek(V, 229) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? 30 : ((abs((abs(peek(V, 229) - 5) < 0.00001 ? 1 : 0)) >= 0.00001) ? 30 : ((abs((abs(peek(V, 229) - 6) < 0.00001 ? 1 : 0)) >= 0.00001) ? 35 : ((abs((abs(peek(V, 229) - 7) < 0.00001 ? 1 : 0)) >= 0.00001) ? 35 : ((abs((abs(peek(V, 229) - 8) < 0.00001 ? 1 : 0)) >= 0.00001) ? 20 : ((abs((abs(peek(V, 229) - 9) < 0.00001 ? 1 : 0)) >= 0.00001) ? 18 : ((abs((abs(peek(V, 229) - 10) < 0.00001 ? 1 : 0)) >= 0.00001) ? 18 : 20)))))))))));\n      poke(V, t136, 259);\n      t137 = f_mode_add(V, M, mq, peek(V, 231), (1 / peek(V, 259)), 1, ((abs((peek(V, 229) >= 8 ? 1 : 0)) >= 0.00001) ? 0.7 : (1 / sqrt(abs((1 + (0.5 * peek(V, 229))))))), sin(((peek(V, 229) * 2.1) + 0.4)), cos(((peek(V, 229) * 1.3) + 0.9)));\n      t138 = (peek(V, 229) + 1);\n      poke(V, t138, 229);\n    }\n    t139 = f_fdn_setup(V, M, mq, 0.025, 0.4, 0.1, 2, 1);\n    poke(V, 1, 146);\n    poke(V, 0.3, 145);\n    poke(V, 0.2, 144);\n    poke(V, 0.8, 149);\n    poke(V, 0.1, 148);\n    poke(V, 0.25, 152);\n    poke(V, 0.65, 151);\n    poke(V, 0.1, 150);\n    t140 = peek(M, trunc(peek(V, 109) + 12 + 0.00001));\n    poke(V, t140, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 13) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    poke(V, 0, 229);\n    t141 = min(1048576, trunc(9));\n    for (t142 = 0; t142 < t141; t142 += 1) {\n      t143 = ((abs((abs(peek(V, 229) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 50 : ((abs((abs(peek(V, 229) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 57 : ((abs((abs(peek(V, 229) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 58 : ((abs((abs(peek(V, 229) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 60 : ((abs((abs(peek(V, 229) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? 62 : ((abs((abs(peek(V, 229) - 5) < 0.00001 ? 1 : 0)) >= 0.00001) ? 64 : ((abs((abs(peek(V, 229) - 6) < 0.00001 ? 1 : 0)) >= 0.00001) ? 65 : ((abs((abs(peek(V, 229) - 7) < 0.00001 ? 1 : 0)) >= 0.00001) ? 67 : 69))))))));\n      poke(V, t143, 299);\n      t144 = (440 * pow(2, ((peek(V, 299) - 69) / 12)));\n      poke(V, t144, 300);\n      t145 = f_mode_add(V, M, mq, peek(V, 300), 0.0022, 8, 1, cos((peek(V, 229) * 0.7)), sin(((peek(V, 229) * 0.7) + 0.5)));\n      t146 = f_mode_add(V, M, mq, (2 * peek(V, 300)), 0.0028, 8, 0.55, cos(((peek(V, 229) * 0.7) + 0.3)), sin(((peek(V, 229) * 0.7) + 0.9)));\n      t147 = f_mode_add(V, M, mq, (3 * peek(V, 300)), 0.0035, 8, 0.35, cos(((peek(V, 229) * 0.7) + 0.6)), sin(((peek(V, 229) * 0.7) + 1.3)));\n      t148 = (peek(V, 229) + 1);\n      poke(V, t148, 229);\n    }\n    t149 = f_mode_add(V, M, mq, 85, (1 / 12), 2, 0.8, 0.8, 0.8);\n    t150 = (((207 * pow(10, 9)) * pow(0.0012, 3)) / (12 * (1 - pow(0.29, 2))));\n    poke(V, t150, 258);\n    t151 = (7850 * 0.0012);\n    poke(V, t151, 263);\n    t152 = f_plate_density(V, M, mq, 0.44, peek(V, 263), peek(V, 258));\n    t153 = f_t60e(V, M, mq, 200, 0.003, 3);\n    t154 = f_t60e(V, M, mq, 4000, 0.003, 3);\n    t155 = f_fdn_setup(V, M, mq, t152, t153, t154, 3, 1);\n    poke(V, 1, 145);\n    poke(V, 1, 144);\n    poke(V, 0.75, 151);\n    poke(V, 0.25, 150);\n    poke(V, 0.3, 165);\n    t156 = peek(M, trunc(peek(V, 109) + 13 + 0.00001));\n    poke(V, t156, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 14) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t157 = f_tube_add(V, M, mq, 0.1, 0.022, 2, 4, 1, 1, 0.3);\n    t158 = f_tube_add(V, M, mq, 0.104, 0.0225, 2, 4, 1, 0.3, 1);\n    t159 = f_ring_modes(V, M, mq, 0.0225, 0.0015, (3 * pow(10, 9)), 700, 0.3, 0.06, 0.3, 5, 0.6);\n    poke(V, 1, 146);\n    poke(V, 1, 145);\n    poke(V, 0.75, 152);\n    poke(V, 0.25, 151);\n    t160 = peek(M, trunc(peek(V, 109) + 14 + 0.00001));\n    poke(V, t160, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 15) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t161 = (((69 * pow(10, 9)) * pow(0.000016, 3)) / (12 * (1 - pow(0.33, 2))));\n    poke(V, t161, 258);\n    t162 = (2700 * 0.000016);\n    poke(V, t162, 263);\n    t163 = f_plate_density(V, M, mq, 0.135, peek(V, 263), peek(V, 258));\n    t164 = f_fdn_setup(V, M, mq, t163, 0.35, 0.12, 5, 1);\n    poke(V, 0, 229);\n    t165 = min(1048576, trunc(12));\n    for (t166 = 0; t166 < t165; t166 += 1) {\n      t167 = f_mode_add(V, M, mq, (1500 * pow(1.19, peek(V, 229))), 0.02, 0.2, 0.6, sin(((peek(V, 229) * 2.3) + 0.2)), cos(((peek(V, 229) * 1.9) + 0.7)));\n      t168 = (peek(V, 229) + 1);\n      poke(V, t168, 229);\n    }\n    poke(V, 1, 144);\n    poke(V, 0.5, 145);\n    poke(V, 0.75, 150);\n    poke(V, 0.25, 151);\n    poke(V, 1, 164);\n    poke(V, 1, 163);\n    poke(V, 0.5, 162);\n    poke(V, 0.3, 161);\n    poke(V, 0.3, 158);\n    poke(V, 1, 156);\n    poke(V, 0.5, 153);\n    poke(V, 3000, 159);\n    poke(V, 200, 167);\n    poke(V, 250, 171);\n    t169 = peek(M, trunc(peek(V, 109) + 15 + 0.00001));\n    poke(V, t169, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 16) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    t170 = f_membrane_modes(V, M, mq, 0.15, 15, 0.011, 0.12, 0.4, 20, 0.3, 0.3);\n    t171 = f_fdn_setup(V, M, mq, 0.03, 0.2, 0.08, 2, 1);\n    poke(V, 1, 145);\n    poke(V, 0.6, 144);\n    poke(V, 0.7, 151);\n    poke(V, 0.3, 150);\n    poke(V, 1, 166);\n    poke(V, 1, 158);\n    poke(V, 1, 155);\n    poke(V, 0.8, 153);\n    poke(V, 400, 159);\n    poke(V, 0.35, 160);\n    t172 = peek(M, trunc(peek(V, 109) + 16 + 0.00001));\n    poke(V, t172, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 17) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    poke(V, 0.0005, 262);\n    t173 = (((207 * pow(10, 9)) * pow(peek(V, 262), 3)) / (12 * (1 - pow(0.3, 2))));\n    poke(V, t173, 303);\n    t174 = ((((207 * pow(10, 9)) * peek(V, 262)) * pow(0.018, 2)) / 8);\n    poke(V, t174, 304);\n    t175 = (7850 * peek(V, 262));\n    poke(V, t175, 263);\n    t176 = f_plate_modes(V, M, mq, 0.9, 0.8, peek(V, 263), peek(V, 304), peek(V, 303), peek(V, 303), 0.004, 2.5, 28, 0.2);\n    t177 = (((0.5 * 5.8) * sqrt(abs(peek(V, 263)))) / pow((peek(V, 304) * peek(V, 303)), 0.25));\n    t178 = f_t60e(V, M, mq, 200, 0.004, 2.5);\n    t179 = f_t60e(V, M, mq, 4000, 0.004, 2.5);\n    t180 = f_fdn_setup(V, M, mq, t177, t178, t179, 3, 1.6);\n    poke(V, 1, 145);\n    poke(V, 1, 144);\n    poke(V, 0.35, 151);\n    poke(V, 0.65, 150);\n    poke(V, 1, 158);\n    poke(V, 1, 156);\n    poke(V, 0.5, 155);\n    poke(V, 0.7, 153);\n    poke(V, 1800, 159);\n    poke(V, 1.4, 160);\n    t181 = peek(M, trunc(peek(V, 109) + 17 + 0.00001));\n    poke(V, t181, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 18) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    poke(V, 0.286, 261);\n    poke(V, 0.851, 262);\n    poke(V, 0, 229);\n    t182 = min(1048576, trunc(40));\n    for (t183 = 0; t183 < t182; t183 += 1) {\n      t184 = eel_mod(peek(V, 229), 5);\n      poke(V, t184, 305);\n      t185 = floor((peek(V, 229) / 5));\n      poke(V, t185, 265);\n      t186 = ((abs((abs(peek(V, 265) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0 : ((abs((abs(peek(V, 265) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 1.8412 : ((abs((abs(peek(V, 265) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 3.0542 : ((abs((abs(peek(V, 265) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 3.8317 : ((abs((abs(peek(V, 265) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? 4.2012 : ((abs((abs(peek(V, 265) - 5) < 0.00001 ? 1 : 0)) >= 0.00001) ? 5.3176 : ((abs((abs(peek(V, 265) - 6) < 0.00001 ? 1 : 0)) >= 0.00001) ? 5.3314 : 6.4156)))))));\n      poke(V, t186, 306);\n      t187 = ((0.5 * peek(V, 100)) * sqrt(abs((pow((peek(V, 305) / peek(V, 262)), 2) + pow((peek(V, 306) / (3.141592653589793 * peek(V, 261))), 2)))));\n      poke(V, t187, 231);\n      if ((abs((((abs((peek(V, 231) > 0 ? 1 : 0)) >= 0.00001) && (abs((peek(V, 231) < 900 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n        t188 = f_mode_add(V, M, mq, peek(V, 231), (1 / 60), 3, (0.8 / sqrt(abs((1 + (0.3 * peek(V, 229)))))), cos(((peek(V, 305) * 1.3) + (peek(V, 265) * 0.7))), cos(((peek(V, 305) * 0.4) + (peek(V, 265) * 2.2))));\n      }\n      t189 = (peek(V, 229) + 1);\n      poke(V, t189, 229);\n    }\n    t190 = (((207 * pow(10, 9)) * pow(0.0024, 3)) / (12 * (1 - pow(0.29, 2))));\n    poke(V, t190, 258);\n    t191 = (7850 * 0.0012);\n    poke(V, t191, 263);\n    t192 = (sqrt(abs((peek(V, 258) / peek(V, 263)))) / (((2 * 3.141592653589793) * peek(V, 261)) * peek(V, 261)));\n    poke(V, t192, 259);\n    poke(V, 0, 229);\n    t193 = min(1048576, trunc(8));\n    for (t194 = 0; t194 < t193; t194 += 1) {\n      t195 = ((abs((abs(peek(V, 229) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 10.216 : ((abs((abs(peek(V, 229) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 21.26 : ((abs((abs(peek(V, 229) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 34.88 : ((abs((abs(peek(V, 229) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 39.77 : ((abs((abs(peek(V, 229) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? 51.04 : ((abs((abs(peek(V, 229) - 5) < 0.00001 ? 1 : 0)) >= 0.00001) ? 60.83 : ((abs((abs(peek(V, 229) - 6) < 0.00001 ? 1 : 0)) >= 0.00001) ? 69.67 : 84.58)))))));\n      poke(V, t195, 264);\n      t196 = f_mode_add(V, M, mq, (peek(V, 259) * peek(V, 264)), 0.002, 3, (0.6 / sqrt(abs((1 + peek(V, 229))))), sin(((peek(V, 229) * 1.7) + 0.3)), cos(((peek(V, 229) * 1.1) + 0.2)));\n      t197 = f_mode_add(V, M, mq, ((peek(V, 259) * peek(V, 264)) * 0.98), 0.002, 3, (0.6 / sqrt(abs((1 + peek(V, 229))))), cos(((peek(V, 229) * 2.3) + 0.1)), sin(((peek(V, 229) * 0.8) + 0.6)));\n      t198 = (peek(V, 229) + 1);\n      poke(V, t198, 229);\n    }\n    t199 = (((207 * pow(10, 9)) * pow(0.0012, 3)) / (12 * (1 - pow(0.29, 2))));\n    poke(V, t199, 258);\n    t200 = f_plate_density(V, M, mq, (((2 * 3.141592653589793) * peek(V, 261)) * peek(V, 262)), peek(V, 263), peek(V, 258));\n    t201 = f_t60e(V, M, mq, 200, 0.0015, 4);\n    t202 = f_t60e(V, M, mq, 4000, 0.0015, 4);\n    t203 = f_fdn_setup(V, M, mq, t200, t201, t202, 3, 1);\n    poke(V, 120, 170);\n    poke(V, 1, 145);\n    poke(V, 1, 144);\n    poke(V, 0.55, 151);\n    poke(V, 0.45, 150);\n    poke(V, 0.3, 165);\n    t204 = peek(M, trunc(peek(V, 109) + 18 + 0.00001));\n    poke(V, t204, 173);\n  }\n  if ((abs((abs(peek(V, 129) - 19) < 0.00001 ? 1 : 0)) >= 0.00001)) {\n    poke(V, 0.36, 230);\n    poke(V, 0.0115, 261);\n    poke(V, 0.0065, 262);\n    t205 = (((22.373 / (((2 * 3.141592653589793) * peek(V, 230)) * peek(V, 230))) * sqrt(abs(((18 * pow(10, 9)) / 1900)))) * sqrt(abs((((peek(V, 261) * peek(V, 261)) + (peek(V, 262) * peek(V, 262))) / 4))));\n    poke(V, t205, 231);\n    poke(V, 0, 229);\n    t206 = min(1048576, trunc(6));\n    for (t207 = 0; t207 < t206; t207 += 1) {\n      t208 = ((abs((abs(peek(V, 229) - 0) < 0.00001 ? 1 : 0)) >= 0.00001) ? 0.60938 : ((abs((abs(peek(V, 229) - 1) < 0.00001 ? 1 : 0)) >= 0.00001) ? 1.96688 : ((abs((abs(peek(V, 229) - 2) < 0.00001 ? 1 : 0)) >= 0.00001) ? 4.18833 : ((abs((abs(peek(V, 229) - 3) < 0.00001 ? 1 : 0)) >= 0.00001) ? 7.28482 : ((abs((abs(peek(V, 229) - 4) < 0.00001 ? 1 : 0)) >= 0.00001) ? 11.2601 : 16.116)))));\n      poke(V, t208, 259);\n      t209 = f_mode_add(V, M, mq, (peek(V, 231) * peek(V, 259)), 0.02, 2.5, (1 / sqrt(abs((1 + peek(V, 229))))), sin(((peek(V, 229) * 1.9) + 0.4)), cos(((peek(V, 229) * 1.3) + 0.2)));\n      t210 = f_mode_add(V, M, mq, ((peek(V, 231) * peek(V, 259)) * 1.28), 0.02, 2.5, (0.8 / sqrt(abs((1 + peek(V, 229))))), cos(((peek(V, 229) * 2.2) + 0.7)), sin(((peek(V, 229) * 0.9) + 0.5)));\n      t211 = (peek(V, 229) + 1);\n      poke(V, t211, 229);\n    }\n    t212 = (sqrt(abs(((18 * pow(10, 9)) / ((2 * 1.3) * 1900)))) / (2 * peek(V, 230)));\n    poke(V, t212, 259);\n    t213 = f_mode_add(V, M, mq, (peek(V, 259) * 0.32034), 0.02, 2.5, 0.35, 0.6, (-0.5));\n    t214 = f_mode_add(V, M, mq, (peek(V, 259) * 1.10109), 0.02, 2.5, 0.25, (-0.4), 0.7);\n    t215 = (sqrt(abs(((18 * pow(10, 9)) / 1900))) / (2 * peek(V, 230)));\n    poke(V, t215, 259);\n    t216 = f_mode_add(V, M, mq, (peek(V, 259) * 0.61938), 0.02, 2.5, 0.25, 0.5, 0.5);\n    t217 = f_mode_add(V, M, mq, (peek(V, 259) * 1.37255), 0.02, 2.5, 0.18, (-0.5), 0.4);\n    t218 = f_tube_add(V, M, mq, 0.26, 0.0065, 0, 1.6, 1, 0.7, 0.7);\n    t219 = (((18 * pow(10, 9)) * pow(0.005, 3)) / (12 * (1 - pow(0.3, 2))));\n    poke(V, t219, 258);\n    t220 = f_plate_density(V, M, mq, (((2 * 3.141592653589793) * 0.009) * peek(V, 230)), (1900 * 0.005), peek(V, 258));\n    t221 = f_t60e(V, M, mq, 200, 0.02, 2.5);\n    t222 = f_t60e(V, M, mq, 4000, 0.02, 2.5);\n    t223 = f_fdn_setup(V, M, mq, t220, t221, t222, 2, 1);\n    poke(V, 1, 145);\n    poke(V, 1, 146);\n    poke(V, 1, 144);\n    poke(V, 0.65, 151);\n    poke(V, 0.2, 152);\n    poke(V, 0.15, 150);\n    poke(V, 1, 158);\n    poke(V, 1, 155);\n    poke(V, 0.7, 153);\n    poke(V, 1200, 159);\n    poke(V, 0.7, 160);\n    poke(V, 60, 167);\n    t224 = peek(M, trunc(peek(V, 109) + 19 + 0.00001));\n    poke(V, t224, 173);\n    r = t224;\n  }\n  else {\n    r = 0;\n  }\n  return r;\n}\n\nf_engine_norms(V, M, mq) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0;\n  r = 0;\n  poke(V, 0, 307);\n  t1 = peek(V, 86);\n  poke(V, t1, 308);\n  t2 = min(1048576, trunc(peek(V, 139)));\n  for (t3 = 0; t3 < t2; t3 += 1) {\n    t4 = ((((peek(M, trunc(peek(V, 308) + 14 + 0.00001)) * peek(M, trunc(peek(V, 308) + 14 + 0.00001))) * 0.5) * ((peek(M, trunc(peek(V, 308) + 15 + 0.00001)) * peek(M, trunc(peek(V, 308) + 15 + 0.00001))) + (peek(M, trunc(peek(V, 308) + 16 + 0.00001)) * peek(M, trunc(peek(V, 308) + 16 + 0.00001))))) * peek(M, trunc(peek(V, 308) + 17 + 0.00001)));\n    t5 = (peek(V, 307) + t4);\n    poke(V, t5, 307);\n    t6 = peek(V, 85);\n    t7 = (peek(V, 308) + t6);\n    poke(V, t7, 308);\n  }\n  t8 = ((abs((peek(V, 307) > 0 ? 1 : 0)) >= 0.00001) ? (1 / sqrt(abs(peek(V, 307)))) : 0);\n  poke(V, t8, 309);\n  poke(V, 0, 307);\n  t9 = peek(V, 89);\n  poke(V, t9, 308);\n  t10 = min(1048576, trunc(peek(V, 140)));\n  for (t11 = 0; t11 < t10; t11 += 1) {\n    t12 = ((0.5 * ((peek(M, trunc(peek(V, 308) + 7 + 0.00001)) * peek(M, trunc(peek(V, 308) + 7 + 0.00001))) + (peek(M, trunc(peek(V, 308) + 8 + 0.00001)) * peek(M, trunc(peek(V, 308) + 8 + 0.00001))))) / (2 * max(1e-9, (1 - (peek(M, trunc(peek(V, 308) + 9 + 0.00001)) * peek(M, trunc(peek(V, 308) + 9 + 0.00001)))))));\n    t13 = (peek(V, 307) + t12);\n    poke(V, t13, 307);\n    t14 = peek(V, 88);\n    t15 = (peek(V, 308) + t14);\n    poke(V, t15, 308);\n  }\n  t16 = ((abs((peek(V, 307) > 0 ? 1 : 0)) >= 0.00001) ? (1 / sqrt(abs(peek(V, 307)))) : 0);\n  poke(V, t16, 310);\n  poke(V, 0, 307);\n  t17 = peek(V, 91);\n  poke(V, t17, 308);\n  poke(V, 0, 311);\n  t18 = min(1048576, trunc(8));\n  for (t19 = 0; t19 < t18; t19 += 1) {\n    t20 = peek(M, trunc(peek(V, 308) + 10 + 0.00001));\n    t21 = (peek(V, 307) + t20);\n    poke(V, t21, 307);\n    t22 = peek(V, 90);\n    t23 = (peek(V, 308) + t22);\n    poke(V, t23, 308);\n    t24 = (peek(V, 311) + 1);\n    poke(V, t24, 311);\n  }\n  t25 = (peek(V, 111) / 64);\n  t26 = (peek(V, 307) * t25);\n  poke(V, t26, 307);\n  t27 = ((abs((((abs(peek(V, 141)) >= 0.00001) && (abs((peek(V, 307) > 0 ? 1 : 0)) >= 0.00001)) ? 1 : 0)) >= 0.00001) ? (1 / sqrt(abs(peek(V, 307)))) : 0);\n  poke(V, t27, 312);\n  r = t27;\n  return r;\n}\n\nf_hp1(V, M, mq, p0) {\n  r = 0;\n  r = exp(((((-2) * 3.141592653589793) * p0) / peek(V, 78)));\n  return r;\n}\n\nf_lp1(V, M, mq, p0) {\n  r = 0;\n  r = (1 - exp(((((-2) * 3.141592653589793) * min(p0, (0.49 * peek(V, 78)))) / peek(V, 78))));\n  return r;\n}\n\nf_bq_lp(V, M, mq, p0, p1, p2) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0;\n  r = 0;\n  t1 = (((2 * 3.141592653589793) * min(p1, (0.45 * peek(V, 78)))) / peek(V, 78));\n  poke(V, t1, 320);\n  t2 = (sin(peek(V, 320)) / (2 * p2));\n  poke(V, t2, 321);\n  t3 = cos(peek(V, 320));\n  poke(V, t3, 322);\n  t4 = (1 + peek(V, 321));\n  poke(V, t4, 323);\n  t5 = trunc(p0 + 0.00001);\n  t6 = (((1 - peek(V, 322)) / 2) / peek(V, 323));\n  poke(M, t6, t5);\n  t7 = trunc(p0 + 1 + 0.00001);\n  t8 = ((1 - peek(V, 322)) / peek(V, 323));\n  poke(M, t8, t7);\n  t9 = trunc(p0 + 2 + 0.00001);\n  t10 = (((1 - peek(V, 322)) / 2) / peek(V, 323));\n  poke(M, t10, t9);\n  t11 = trunc(p0 + 3 + 0.00001);\n  t12 = (((-2) * peek(V, 322)) / peek(V, 323));\n  poke(M, t12, t11);\n  t13 = trunc(p0 + 4 + 0.00001);\n  t14 = ((1 - peek(V, 321)) / peek(V, 323));\n  poke(M, t14, t13);\n  r = t14;\n  return r;\n}\n\nf_rebuild(V, M, mq, p0) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0; t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0; t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0;\n  r = 0;\n  t1 = eel_bor(peek(V, 0), 0);\n  poke(V, t1, 129);\n  t2 = (peek(V, 2) / 100);\n  poke(V, t2, 130);\n  t3 = (pow(2, (peek(V, 5) / 12)) / peek(V, 130));\n  poke(V, t3, 131);\n  t4 = max(1, floor(((peek(V, 78) / 24000) + 0.5)));\n  poke(V, t4, 132);\n  t5 = p0;\n  poke(V, t5, 133);\n  poke(V, 0, 134);\n  if ((abs(p0) >= 0.00001)) {\n    t6 = peek(V, 120);\n    poke(V, t6, 135);\n    t7 = peek(V, 96);\n    poke(V, t7, 136);\n  }\n  t8 = peek(V, 130);\n  poke(V, t8, 137);\n  poke(V, 1, 138);\n  t9 = f_setup_material(V, M, mq);\n  t10 = peek(V, 139);\n  poke(V, t10, 193);\n  t11 = peek(V, 140);\n  poke(V, t11, 233);\n  t12 = peek(V, 141);\n  poke(V, t12, 257);\n  if ((abs(p0) >= 0.00001)) {\n    t13 = max(peek(V, 122), peek(V, 135));\n    poke(V, t13, 122);\n    t14 = peek(V, 120);\n    t15 = min(trunc((peek(V, 122) - peek(V, 120))), 8388608);\n    for (t16 = 0; t16 < t15; t16 += 1) {\n      poke(M, 0, trunc(t14 + t16 + 0.00001));\n    }\n    t17 = peek(V, 96);\n    t18 = min(trunc((peek(V, 97) - peek(V, 96))), 8388608);\n    for (t19 = 0; t19 < t18; t19 += 1) {\n      poke(M, 0, trunc(t17 + t19 + 0.00001));\n    }\n    t20 = peek(V, 135);\n    poke(V, t20, 122);\n    t21 = peek(V, 92);\n    t22 = min(trunc(8), 8388608);\n    for (t23 = 0; t23 < t22; t23 += 1) {\n      poke(M, 0, trunc(t21 + t23 + 0.00001));\n    }\n  }\n  t24 = f_engine_norms(V, M, mq);\n  t25 = (peek(V, 3) / 100);\n  poke(V, t25, 313);\n  if ((abs((((abs((abs(peek(V, 313) - 1) < 0.00001 ? 0 : 1)) >= 0.00001) || (abs((abs(peek(V, 4) - 0) < 0.00001 ? 0 : 1)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n    poke(V, 0, 133);\n    t26 = (peek(V, 130) * peek(V, 313));\n    poke(V, t26, 137);\n    t27 = pow(2, (peek(V, 4) / 50));\n    poke(V, t27, 138);\n    t28 = f_setup_material(V, M, mq);\n  }\n  t29 = f_hp1(V, M, mq, peek(V, 167));\n  poke(V, t29, 314);\n  t30 = f_lp1(V, M, mq, peek(V, 168));\n  poke(V, t30, 315);\n  t31 = f_hp1(V, M, mq, peek(V, 170));\n  poke(V, t31, 316);\n  t32 = f_hp1(V, M, mq, peek(V, 171));\n  poke(V, t32, 317);\n  if ((abs((peek(V, 172) >= 20000 ? 1 : 0)) >= 0.00001)) {\n    t33 = 1;\n  }\n  else {\n    t34 = f_lp1(V, M, mq, peek(V, 172));\n    t33 = t34;\n  }\n  poke(V, t33, 318);\n  t35 = f_hp1(V, M, mq, peek(V, 159));\n  poke(V, t35, 319);\n  if ((abs((peek(V, 169) > 0 ? 1 : 0)) >= 0.00001)) {\n    t36 = f_bq_lp(V, M, mq, peek(V, 112), peek(V, 169), 0.707);\n  }\n  t37 = pow(10, (peek(V, 173) / 20));\n  poke(V, t37, 324);\n  t38 = exp(((-1) / (0.05 * peek(V, 78))));\n  poke(V, t38, 325);\n  r = t38;\n  return r;\n}\n\nf_bq_hp(V, M, mq, p0, p1, p2) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0;\n  r = 0;\n  t1 = (((2 * 3.141592653589793) * min(p1, (0.45 * peek(V, 78)))) / peek(V, 78));\n  poke(V, t1, 340);\n  t2 = (sin(peek(V, 340)) / (2 * p2));\n  poke(V, t2, 341);\n  t3 = cos(peek(V, 340));\n  poke(V, t3, 342);\n  t4 = (1 + peek(V, 341));\n  poke(V, t4, 343);\n  t5 = trunc(p0 + 0.00001);\n  t6 = (((1 + peek(V, 342)) / 2) / peek(V, 343));\n  poke(M, t6, t5);\n  t7 = trunc(p0 + 1 + 0.00001);\n  t8 = ((-(1 + peek(V, 342))) / peek(V, 343));\n  poke(M, t8, t7);\n  t9 = trunc(p0 + 2 + 0.00001);\n  t10 = (((1 + peek(V, 342)) / 2) / peek(V, 343));\n  poke(M, t10, t9);\n  t11 = trunc(p0 + 3 + 0.00001);\n  t12 = (((-2) * peek(V, 342)) / peek(V, 343));\n  poke(M, t12, t11);\n  t13 = trunc(p0 + 4 + 0.00001);\n  t14 = ((1 - peek(V, 341)) / peek(V, 343));\n  poke(M, t14, t13);\n  r = t14;\n  return r;\n}\n\nf_update_io(V, M, mq) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0;\n  r = 0;\n  t1 = (peek(V, 1) / 100);\n  poke(V, t1, 328);\n  t2 = min(1, (2 * peek(V, 328)));\n  poke(V, t2, 329);\n  t3 = min(1, (2 * (1 - peek(V, 328))));\n  poke(V, t3, 330);\n  t4 = pow(10, (peek(V, 11) / 20));\n  poke(V, t4, 331);\n  t5 = (peek(V, 8) / 100);\n  poke(V, t5, 332);\n  t6 = floor(((peek(V, 6) * 0.001) * peek(V, 78)));\n  poke(V, t6, 333);\n  t7 = (peek(V, 7) / 100);\n  poke(V, t7, 334);\n  t8 = ((peek(V, 158) * peek(V, 160)) * ((0.3 + (12 * peek(V, 334))) + ((30 * peek(V, 334)) * peek(V, 334))));\n  poke(V, t8, 335);\n  t9 = (1 / sqrt(abs((1 + (0.5 * peek(V, 335))))));\n  poke(V, t9, 336);\n  t10 = (((peek(V, 164) * (0.2 + (2 * peek(V, 334)))) * 1500) / peek(V, 78));\n  poke(V, t10, 337);\n  t11 = (((peek(V, 165) * 1.2) * peek(V, 334)) * peek(V, 334));\n  poke(V, t11, 338);\n  t12 = ((0.08 * peek(V, 166)) * (0.2 + peek(V, 334)));\n  poke(V, t12, 339);\n  t13 = f_bq_hp(V, M, mq, (peek(V, 112) + 5), peek(V, 9), 0.707);\n  t14 = f_bq_lp(V, M, mq, (peek(V, 112) + 10), peek(V, 10), 0.707);\n  t15 = (peek(V, 9) > 20.5 ? 1 : 0);\n  poke(V, t15, 344);\n  t16 = (peek(V, 10) < 19999 ? 1 : 0);\n  poke(V, t16, 345);\n  r = t16;\n  return r;\n}\n\nf_apply_params(V, M, mq) {\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0;\n  r = 0;\n  if ((abs((((abs((((abs((abs(eel_bor(peek(V, 0), 0) - peek(V, 123)) < 0.00001 ? 0 : 1)) >= 0.00001) || (abs((abs(peek(V, 2) - peek(V, 127)) < 0.00001 ? 0 : 1)) >= 0.00001)) ? 1 : 0)) >= 0.00001) || (abs((abs(peek(V, 5) - peek(V, 128)) < 0.00001 ? 0 : 1)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n    t1 = f_rebuild(V, M, mq, 1);\n  }\n  else {\n    if ((abs((((abs((abs(peek(V, 3) - peek(V, 326)) < 0.00001 ? 0 : 1)) >= 0.00001) || (abs((abs(peek(V, 4) - peek(V, 327)) < 0.00001 ? 0 : 1)) >= 0.00001)) ? 1 : 0)) >= 0.00001)) {\n      t2 = f_rebuild(V, M, mq, 0);\n    }\n  }\n  t3 = eel_bor(peek(V, 0), 0);\n  poke(V, t3, 123);\n  t4 = peek(V, 2);\n  poke(V, t4, 127);\n  t5 = peek(V, 5);\n  poke(V, t5, 128);\n  t6 = peek(V, 3);\n  poke(V, t6, 326);\n  t7 = peek(V, 4);\n  poke(V, t7, 327);\n  t8 = f_update_io(V, M, mq);\n  if ((abs((peek(V, 126) < 0 ? 1 : 0)) >= 0.00001)) {\n    t9 = peek(V, 329);\n    poke(V, t9, 346);\n    t10 = peek(V, 330);\n    poke(V, t10, 347);\n    t11 = peek(V, 331);\n    poke(V, t11, 348);\n    t12 = peek(V, 332);\n    poke(V, t12, 349);\n    poke(V, 0, 126);\n    r = 0;\n  }\n  else {\n    r = 0;\n  }\n  return r;\n}\n\n// every sample\n  t1 = 0; t2 = 0; t3 = 0; t4 = 0; t5 = 0; t6 = 0; t7 = 0; t8 = 0; t9 = 0; t10 = 0; t11 = 0; t12 = 0; t13 = 0; t14 = 0; t15 = 0; t16 = 0;\n  t17 = 0; t18 = 0; t19 = 0; t20 = 0; t21 = 0; t22 = 0; t23 = 0; t24 = 0; t25 = 0; t26 = 0; t27 = 0; t28 = 0; t29 = 0; t30 = 0; t31 = 0; t32 = 0;\n  t33 = 0; t34 = 0; t35 = 0; t36 = 0; t37 = 0; t38 = 0; t39 = 0; t40 = 0; t41 = 0; t42 = 0; t43 = 0; t44 = 0; t45 = 0; t46 = 0; t47 = 0; t48 = 0;\n  t49 = 0; t50 = 0; t51 = 0; t52 = 0; t53 = 0; t54 = 0; t55 = 0; t56 = 0; t57 = 0; t58 = 0; t59 = 0; t60 = 0; t61 = 0; t62 = 0; t63 = 0; t64 = 0;\n  t65 = 0; t66 = 0; t67 = 0; t68 = 0; t69 = 0; t70 = 0; t71 = 0; t72 = 0; t73 = 0; t74 = 0; t75 = 0; t76 = 0; t77 = 0; t78 = 0; t79 = 0; t80 = 0;\n  t81 = 0; t82 = 0; t83 = 0; t84 = 0; t85 = 0; t86 = 0; t87 = 0; t88 = 0; t89 = 0; t90 = 0; t91 = 0; t92 = 0; t93 = 0; t94 = 0; t95 = 0; t96 = 0;\n  t97 = 0; t98 = 0; t99 = 0; t100 = 0; t101 = 0; t102 = 0; t103 = 0; t104 = 0; t105 = 0; t106 = 0; t107 = 0; t108 = 0; t109 = 0; t110 = 0; t111 = 0; t112 = 0;\n  t113 = 0; t114 = 0; t115 = 0; t116 = 0; t117 = 0; t118 = 0; t119 = 0; t120 = 0; t121 = 0; t122 = 0; t123 = 0; t124 = 0; t125 = 0; t126 = 0; t127 = 0; t128 = 0;\n  t129 = 0; t130 = 0; t131 = 0; t132 = 0; t133 = 0; t134 = 0; t135 = 0; t136 = 0; t137 = 0; t138 = 0; t139 = 0; t140 = 0; t141 = 0; t142 = 0; t143 = 0; t144 = 0;\n  t145 = 0; t146 = 0; t147 = 0; t148 = 0; t149 = 0; t150 = 0; t151 = 0; t152 = 0; t153 = 0; t154 = 0; t155 = 0; t156 = 0; t157 = 0; t158 = 0; t159 = 0; t160 = 0;\n  t161 = 0; t162 = 0; t163 = 0; t164 = 0; t165 = 0; t166 = 0; t167 = 0; t168 = 0; t169 = 0; t170 = 0; t171 = 0; t172 = 0; t173 = 0; t174 = 0; t175 = 0; t176 = 0;\n  t177 = 0; t178 = 0; t179 = 0; t180 = 0; t181 = 0; t182 = 0; t183 = 0; t184 = 0; t185 = 0; t186 = 0; t187 = 0; t188 = 0; t189 = 0; t190 = 0; t191 = 0; t192 = 0;\n  t193 = 0; t194 = 0; t195 = 0; t196 = 0; t197 = 0; t198 = 0; t199 = 0; t200 = 0; t201 = 0; t202 = 0; t203 = 0; t204 = 0; t205 = 0; t206 = 0; t207 = 0; t208 = 0;\n  t209 = 0; t210 = 0; t211 = 0; t212 = 0; t213 = 0; t214 = 0; t215 = 0; t216 = 0; t217 = 0; t218 = 0; t219 = 0; t220 = 0; t221 = 0; t222 = 0; t223 = 0; t224 = 0;\n  t225 = 0; t226 = 0; t227 = 0; t228 = 0; t229 = 0; t230 = 0; t231 = 0; t232 = 0; t233 = 0; t234 = 0; t235 = 0; t236 = 0; t237 = 0; t238 = 0; t239 = 0; t240 = 0;\n  t241 = 0; t242 = 0; t243 = 0; t244 = 0; t245 = 0; t246 = 0; t247 = 0; t248 = 0; t249 = 0; t250 = 0; t251 = 0; t252 = 0; t253 = 0; t254 = 0; t255 = 0; t256 = 0;\n  t257 = 0; t258 = 0; t259 = 0; t260 = 0; t261 = 0; t262 = 0; t263 = 0; t264 = 0; t265 = 0; t266 = 0; t267 = 0; t268 = 0; t269 = 0; t270 = 0; t271 = 0; t272 = 0;\n  t273 = 0; t274 = 0; t275 = 0; t276 = 0; t277 = 0; t278 = 0; t279 = 0; t280 = 0; t281 = 0; t282 = 0; t283 = 0; t284 = 0; t285 = 0; t286 = 0; t287 = 0; t288 = 0;\n  t289 = 0; t290 = 0; t291 = 0; t292 = 0; t293 = 0; t294 = 0; t295 = 0; t296 = 0; t297 = 0; t298 = 0; t299 = 0; t300 = 0; t301 = 0; t302 = 0; t303 = 0; t304 = 0;\n  t305 = 0; t306 = 0; t307 = 0; t308 = 0; t309 = 0; t310 = 0; t311 = 0; t312 = 0; t313 = 0; t314 = 0; t315 = 0; t316 = 0; t317 = 0; t318 = 0; t319 = 0; t320 = 0;\n  t321 = 0; t322 = 0; t323 = 0; t324 = 0; t325 = 0; t326 = 0; t327 = 0; t328 = 0; t329 = 0; t330 = 0; t331 = 0; t332 = 0; t333 = 0; t334 = 0; t335 = 0; t336 = 0;\n  t337 = 0; t338 = 0; t339 = 0; t340 = 0; t341 = 0; t342 = 0; t343 = 0; t344 = 0; t345 = 0; t346 = 0; t347 = 0; t348 = 0; t349 = 0; t350 = 0; t351 = 0; t352 = 0;\n  t353 = 0; t354 = 0; t355 = 0; t356 = 0; t357 = 0; t358 = 0; t359 = 0; t360 = 0; t361 = 0; t362 = 0; t363 = 0; t364 = 0; t365 = 0; t366 = 0; t367 = 0; t368 = 0;\n  t369 = 0; t370 = 0; t371 = 0; t372 = 0; t373 = 0;\n  moved = 0;\n  // @init and @slider, once\n  if (peek(V, 64) == 0) {\n    poke(V, slider1, 0);\n    poke(V, slider1, 65);\n    poke(V, slider2, 1);\n    poke(V, slider2, 66);\n    poke(V, slider3, 2);\n    poke(V, slider3, 67);\n    poke(V, slider4, 3);\n    poke(V, slider4, 68);\n    poke(V, slider5, 4);\n    poke(V, slider5, 69);\n    poke(V, slider6, 5);\n    poke(V, slider6, 70);\n    poke(V, slider7, 6);\n    poke(V, slider7, 71);\n    poke(V, slider8, 7);\n    poke(V, slider8, 72);\n    poke(V, slider9, 8);\n    poke(V, slider9, 73);\n    poke(V, slider10, 9);\n    poke(V, slider10, 74);\n    poke(V, slider11, 10);\n    poke(V, slider11, 75);\n    poke(V, slider12, 11);\n    poke(V, slider12, 76);\n    poke(V, 22222, 77);\n    poke(V, samplerate, 78);\n    poke(V, 2, 79);\n    poke(V, 32, 80);\n    poke(V, tempo, 81);\n    poke(V, ts_num, 82);\n    poke(V, ts_denom, 83);\n    poke(V, 32, 84);\n    poke(V, 24, 85);\n    poke(V, 0, 86);\n    poke(V, 64, 87);\n    poke(V, 12, 88);\n    poke(V, 1024, 89);\n    poke(V, 16, 90);\n    poke(V, 2048, 91);\n    poke(V, 2200, 92);\n    poke(V, 2210, 93);\n    poke(V, 2400, 94);\n    poke(V, 3100, 95);\n    poke(V, 4096, 96);\n    poke(V, 131072, 97);\n    poke(V, 131072, 98);\n    poke(V, 8300000, 99);\n    poke(V, 343.2, 100);\n    poke(V, 1.204, 101);\n    poke(V, 0.00001506, 102);\n    poke(V, 1.4017, 103);\n    poke(V, 0.708, 104);\n    t1 = (sqrt(abs(peek(V, 102))) + ((peek(V, 103) - 1) * sqrt(abs((peek(V, 102) / peek(V, 104))))));\n    poke(V, t1, 105);\n    poke(V, 0, 106);\n    t2 = min(1048576, trunc(8));\n    for (t3 = 0; t3 < t2; t3 += 1) {\n      t4 = trunc(peek(V, 93) + peek(V, 106) + 0.00001);\n      t5 = f_hsign(V, M, mq, 7, peek(V, 106));\n      poke(M, t5, t4);\n      t6 = trunc(peek(V, 93) + (8 + peek(V, 106)) + 0.00001);\n      t7 = f_hsign(V, M, mq, 4, peek(V, 106));\n      poke(M, t7, t6);\n      t8 = (peek(V, 106) + 1);\n      poke(V, t8, 106);\n    }\n    poke(V, 0, 106);\n    t9 = f_jz(V, M, mq, 2.4048, 0);\n    t10 = f_jz(V, M, mq, 3.8317, 1);\n    t11 = f_jz(V, M, mq, 5.1356, 2);\n    t12 = f_jz(V, M, mq, 5.5201, 0);\n    t13 = f_jz(V, M, mq, 6.3802, 3);\n    t14 = f_jz(V, M, mq, 7.0156, 1);\n    t15 = f_jz(V, M, mq, 7.5883, 4);\n    t16 = f_jz(V, M, mq, 8.4172, 2);\n    t17 = f_jz(V, M, mq, 8.6537, 0);\n    t18 = f_jz(V, M, mq, 8.7715, 5);\n    t19 = f_jz(V, M, mq, 9.761, 3);\n    t20 = f_jz(V, M, mq, 9.9361, 6);\n    t21 = f_jz(V, M, mq, 10.1735, 1);\n    t22 = f_jz(V, M, mq, 11.0647, 4);\n    t23 = f_jz(V, M, mq, 11.0864, 7);\n    t24 = f_jz(V, M, mq, 11.6198, 2);\n    t25 = f_jz(V, M, mq, 11.7915, 0);\n    t26 = f_jz(V, M, mq, 12.2251, 8);\n    t27 = f_jz(V, M, mq, 12.3386, 5);\n    t28 = f_jz(V, M, mq, 13.0152, 3);\n    t29 = f_jz(V, M, mq, 13.3237, 1);\n    t30 = f_jz(V, M, mq, 13.3543, 9);\n    t31 = f_jz(V, M, mq, 13.5893, 6);\n    t32 = f_jz(V, M, mq, 14.4755, 10);\n    poke(V, 3200, 109);\n    poke(V, 0, 106);\n    t33 = min(1048576, trunc(20));\n    for (t34 = 0; t34 < t33; t34 += 1) {\n      t35 = trunc(peek(V, 109) + peek(V, 106) + 0.00001);\n      poke(M, 0, t35);\n      t36 = (peek(V, 106) + 1);\n      poke(V, t36, 106);\n    }\n    t37 = trunc(peek(V, 109) + 0.00001);\n    poke(M, 0.4, t37);\n    t38 = trunc(peek(V, 109) + 1 + 0.00001);\n    poke(M, 2.1, t38);\n    t39 = trunc(peek(V, 109) + 2 + 0.00001);\n    poke(M, (-4.7), t39);\n    t40 = trunc(peek(V, 109) + 3 + 0.00001);\n    poke(M, (-6), t40);\n    t41 = trunc(peek(V, 109) + 4 + 0.00001);\n    poke(M, (-10.3), t41);\n    t42 = trunc(peek(V, 109) + 5 + 0.00001);\n    poke(M, (-6.1), t42);\n    t43 = trunc(peek(V, 109) + 6 + 0.00001);\n    poke(M, (-2.1), t43);\n    t44 = trunc(peek(V, 109) + 7 + 0.00001);\n    poke(M, 2.6, t44);\n    t45 = trunc(peek(V, 109) + 8 + 0.00001);\n    poke(M, (-15.6), t45);\n    t46 = trunc(peek(V, 109) + 9 + 0.00001);\n    poke(M, (-17.1), t46);\n    t47 = trunc(peek(V, 109) + 10 + 0.00001);\n    poke(M, (-2.9), t47);\n    t48 = trunc(peek(V, 109) + 11 + 0.00001);\n    poke(M, (-5.2), t48);\n    t49 = trunc(peek(V, 109) + 12 + 0.00001);\n    poke(M, (-5.7), t49);\n    t50 = trunc(peek(V, 109) + 13 + 0.00001);\n    poke(M, (-5.3), t50);\n    t51 = trunc(peek(V, 109) + 14 + 0.00001);\n    poke(M, (-14), t51);\n    t52 = trunc(peek(V, 109) + 15 + 0.00001);\n    poke(M, 3, t52);\n    t53 = trunc(peek(V, 109) + 16 + 0.00001);\n    poke(M, (-4.7), t53);\n    t54 = trunc(peek(V, 109) + 17 + 0.00001);\n    poke(M, (-7.6), t54);\n    t55 = trunc(peek(V, 109) + 18 + 0.00001);\n    poke(M, (-11.8), t55);\n    t56 = trunc(peek(V, 109) + 19 + 0.00001);\n    poke(M, 1.5, t56);\n    poke(V, (-0.9), 110);\n    poke(V, 0.65, 111);\n    poke(V, 3300, 112);\n    poke(V, 3400, 113);\n    t57 = f_ui_knob(V, M, mq, 0, 2, 0, 100, 0, 35, 0.1);\n    t58 = f_ui_knob(V, M, mq, 1, 3, 25, 400, 1, 100, 1);\n    t59 = f_ui_knob(V, M, mq, 2, 4, 10, 400, 1, 100, 1);\n    t60 = f_ui_knob(V, M, mq, 3, 5, (-100), 100, 0, 0, 1);\n    t61 = f_ui_knob(V, M, mq, 4, 6, (-12), 12, 0, 0, 0.1);\n    t62 = f_ui_knob(V, M, mq, 5, 7, 0, 250, 0, 0, 1);\n    t63 = f_ui_knob(V, M, mq, 6, 8, 0, 100, 0, 30, 1);\n    t64 = f_ui_knob(V, M, mq, 7, 9, 0, 150, 0, 100, 1);\n    t65 = f_ui_knob(V, M, mq, 8, 10, 20, 1000, 1, 20, 1);\n    t66 = f_ui_knob(V, M, mq, 9, 11, 1000, 20000, 1, 20000, 10);\n    t67 = f_ui_knob(V, M, mq, 10, 12, (-24), 12, 0, 0, 0.1);\n    poke(V, 1, 114);\n    poke(V, (-1), 115);\n    poke(V, (-1), 116);\n    t68 = (floor((0.26 * peek(V, 78))) + 4);\n    poke(V, t68, 117);\n    t69 = peek(V, 98);\n    poke(V, t69, 118);\n    t70 = (peek(V, 118) + peek(V, 117));\n    poke(V, t70, 119);\n    t71 = (peek(V, 119) + peek(V, 117));\n    poke(V, t71, 120);\n    t72 = peek(V, 118);\n    t73 = min(trunc((2 * peek(V, 117))), 8388608);\n    for (t74 = 0; t74 < t73; t74 += 1) {\n      poke(M, 0, trunc(t72 + t74 + 0.00001));\n    }\n    poke(V, 0, 121);\n    t75 = peek(V, 120);\n    poke(V, t75, 122);\n    poke(V, (-1), 123);\n    poke(V, 0, 124);\n    t76 = 1e-20;\n    poke(V, t76, 125);\n    poke(V, (-1), 126);\n    t77 = f_apply_params(V, M, mq);\n    poke(V, 1, 64);\n  }\n  // a moved slider runs @slider\n  moved = 0;\n  if (slider1 != peek(V, 65)) {\n    poke(V, slider1, 65);\n    poke(V, slider1, 0);\n    moved = 1;\n  }\n  if (slider2 != peek(V, 66)) {\n    poke(V, slider2, 66);\n    poke(V, slider2, 1);\n    moved = 1;\n  }\n  if (slider3 != peek(V, 67)) {\n    poke(V, slider3, 67);\n    poke(V, slider3, 2);\n    moved = 1;\n  }\n  if (slider4 != peek(V, 68)) {\n    poke(V, slider4, 68);\n    poke(V, slider4, 3);\n    moved = 1;\n  }\n  if (slider5 != peek(V, 69)) {\n    poke(V, slider5, 69);\n    poke(V, slider5, 4);\n    moved = 1;\n  }\n  if (slider6 != peek(V, 70)) {\n    poke(V, slider6, 70);\n    poke(V, slider6, 5);\n    moved = 1;\n  }\n  if (slider7 != peek(V, 71)) {\n    poke(V, slider7, 71);\n    poke(V, slider7, 6);\n    moved = 1;\n  }\n  if (slider8 != peek(V, 72)) {\n    poke(V, slider8, 72);\n    poke(V, slider8, 7);\n    moved = 1;\n  }\n  if (slider9 != peek(V, 73)) {\n    poke(V, slider9, 73);\n    poke(V, slider9, 8);\n    moved = 1;\n  }\n  if (slider10 != peek(V, 74)) {\n    poke(V, slider10, 74);\n    poke(V, slider10, 9);\n    moved = 1;\n  }\n  if (slider11 != peek(V, 75)) {\n    poke(V, slider11, 75);\n    poke(V, slider11, 10);\n    moved = 1;\n  }\n  if (slider12 != peek(V, 76)) {\n    poke(V, slider12, 76);\n    poke(V, slider12, 11);\n    moved = 1;\n  }\n  if (moved != 0) {\n    t78 = f_apply_params(V, M, mq);\n  }\n  // @block, every 32 samples\n  if (peek(V, 350) <= 0) {\n    poke(V, 32, 350);\n    poke(V, tempo, 81);\n    poke(V, play_state, 351);\n    poke(V, beat_position, 352);\n    poke(V, beat_position * 60 / max(1, tempo), 353);\n    poke(V, ts_num, 82);\n    poke(V, ts_denom, 83);\n    t79 = (1 - exp(((-1) / (0.02 * peek(V, 78)))));\n    poke(V, t79, 354);\n    if ((abs(peek(V, 355)) >= 0.00001)) {\n      poke(V, 0, 355);\n      t80 = f_apply_params(V, M, mq);\n    }\n    t81 = exp(((-1) / (0.3 * peek(V, 78))));\n    poke(V, t81, 356);\n  }\n  poke(V, peek(V, 350) - 1, 350);\n  // @sample\n  poke(V, in1, 357);\n  poke(V, in2, 358);\n  t82 = ((peek(V, 329) - peek(V, 346)) * peek(V, 354));\n  t83 = (peek(V, 346) + t82);\n  poke(V, t83, 346);\n  t84 = ((peek(V, 330) - peek(V, 347)) * peek(V, 354));\n  t85 = (peek(V, 347) + t84);\n  poke(V, t85, 347);\n  t86 = ((peek(V, 331) - peek(V, 348)) * peek(V, 354));\n  t87 = (peek(V, 348) + t86);\n  poke(V, t87, 348);\n  t88 = ((peek(V, 332) - peek(V, 349)) * peek(V, 354));\n  t89 = (peek(V, 349) + t88);\n  poke(V, t89, 349);\n  t90 = peek(V, 357);\n  poke(V, t90, 359);\n  t91 = peek(V, 358);\n  poke(V, t91, 360);\n  t92 = trunc(peek(V, 118) + peek(V, 121) + 0.00001);\n  t93 = peek(V, 359);\n  poke(M, t93, t92);\n  t94 = trunc(peek(V, 119) + peek(V, 121) + 0.00001);\n  t95 = peek(V, 360);\n  poke(M, t95, t94);\n  t96 = (peek(V, 121) - peek(V, 333));\n  poke(V, t96, 361);\n  if ((abs((peek(V, 361) < 0 ? 1 : 0)) >= 0.00001)) {\n    t97 = peek(V, 117);\n    t98 = (peek(V, 361) + t97);\n    poke(V, t98, 361);\n  }\n  t99 = peek(M, trunc(peek(V, 118) + peek(V, 361) + 0.00001));\n  poke(V, t99, 362);\n  t100 = peek(M, trunc(peek(V, 119) + peek(V, 361) + 0.00001));\n  poke(V, t100, 363);\n  t101 = (peek(V, 121) + 1);\n  poke(V, t101, 121);\n  if ((abs((peek(V, 121) >= peek(V, 117) ? 1 : 0)) >= 0.00001)) {\n    poke(V, 0, 121);\n  }\n  t102 = (0.5 * (peek(V, 362) + peek(V, 363)));\n  poke(V, t102, 364);\n  t103 = (0.5 * (peek(V, 362) - peek(V, 363)));\n  poke(V, t103, 365);\n  t104 = (peek(V, 314) * ((peek(V, 366) + peek(V, 364)) - peek(V, 367)));\n  poke(V, t104, 366);\n  t105 = peek(V, 364);\n  poke(V, t105, 367);\n  t106 = (peek(V, 315) * (peek(V, 366) - peek(V, 368)));\n  t107 = (peek(V, 368) + t106);\n  poke(V, t107, 368);\n  t108 = peek(V, 368);\n  poke(V, t108, 369);\n  t109 = (peek(V, 314) * ((peek(V, 370) + peek(V, 365)) - peek(V, 371)));\n  poke(V, t109, 370);\n  t110 = peek(V, 365);\n  poke(V, t110, 371);\n  t111 = peek(V, 370);\n  poke(V, t111, 372);\n  t112 = abs(peek(V, 369));\n  poke(V, t112, 373);\n  t113 = ((abs((peek(V, 373) > peek(V, 374) ? 1 : 0)) >= 0.00001) ? peek(V, 373) : (peek(V, 374) * peek(V, 325)));\n  poke(V, t113, 374);\n  t114 = (-peek(V, 125));\n  poke(V, t114, 125);\n  t115 = (peek(V, 124) + 1);\n  poke(V, t115, 124);\n  if ((abs((peek(V, 124) >= 720720 ? 1 : 0)) >= 0.00001)) {\n    poke(V, 0, 124);\n  }\n  if ((abs((peek(V, 164) > 0 ? 1 : 0)) >= 0.00001)) {\n    poke(V, peek(V, 77) * 16807 - 2147483647 * floor(peek(V, 77) * 16807 / 2147483647), 77);\n    if ((abs(((peek(V, 77) / 2147483647 * 1) < (peek(V, 337) * min(1, (4 * peek(V, 374)))) ? 1 : 0)) >= 0.00001)) {\n      poke(V, peek(V, 77) * 16807 - 2147483647 * floor(peek(V, 77) * 16807 / 2147483647), 77);\n      t116 = (((peek(V, 77) / 2147483647 * 2) - 1) * (0.2 + peek(V, 374)));\n    }\n    else {\n      t116 = 0;\n    }\n    poke(V, t116, 375);\n  }\n  else {\n    poke(V, 0, 375);\n  }\n  poke(V, 0, 376);\n  poke(V, 0, 377);\n  if ((abs((peek(V, 139) > 0 ? 1 : 0)) >= 0.00001)) {\n    t117 = (peek(V, 369) * peek(V, 146));\n    poke(V, t117, 378);\n    if ((abs((peek(V, 169) > 0 ? 1 : 0)) >= 0.00001)) {\n      t118 = (((((peek(M, trunc(peek(V, 112) + 0.00001)) * peek(V, 378)) + (peek(M, trunc(peek(V, 112) + 1 + 0.00001)) * peek(V, 379))) + (peek(M, trunc(peek(V, 112) + 2 + 0.00001)) * peek(V, 380))) - (peek(M, trunc(peek(V, 112) + 3 + 0.00001)) * peek(V, 381))) - (peek(M, trunc(peek(V, 112) + 4 + 0.00001)) * peek(V, 382)));\n      poke(V, t118, 383);\n      t119 = peek(V, 379);\n      poke(V, t119, 380);\n      t120 = peek(V, 378);\n      poke(V, t120, 379);\n      t121 = peek(V, 381);\n      poke(V, t121, 382);\n      t122 = peek(V, 383);\n      poke(V, t122, 381);\n      t123 = (((((peek(M, trunc(peek(V, 112) + 0.00001)) * peek(V, 383)) + (peek(M, trunc(peek(V, 112) + 1 + 0.00001)) * peek(V, 384))) + (peek(M, trunc(peek(V, 112) + 2 + 0.00001)) * peek(V, 385))) - (peek(M, trunc(peek(V, 112) + 3 + 0.00001)) * peek(V, 386))) - (peek(M, trunc(peek(V, 112) + 4 + 0.00001)) * peek(V, 387)));\n      poke(V, t123, 388);\n      t124 = peek(V, 384);\n      poke(V, t124, 385);\n      t125 = peek(V, 383);\n      poke(V, t125, 384);\n      t126 = peek(V, 386);\n      poke(V, t126, 387);\n      t127 = peek(V, 388);\n      poke(V, t127, 386);\n      t128 = peek(V, 388);\n      poke(V, t128, 378);\n    }\n    t129 = peek(V, 125);\n    t130 = (peek(V, 378) + t129);\n    poke(V, t130, 378);\n    t131 = peek(V, 86);\n    poke(V, t131, 389);\n    t132 = min(1048576, trunc(peek(V, 139)));\n    for (t133 = 0; t133 < t132; t133 += 1) {\n      t134 = peek(M, trunc(peek(V, 389) + 0.00001));\n      poke(V, t134, 390);\n      t135 = peek(M, trunc(peek(V, 389) + 1 + 0.00001));\n      poke(V, t135, 391);\n      t136 = peek(M, trunc(peek(V, 389) + 2 + 0.00001));\n      poke(V, t136, 392);\n      t137 = (peek(V, 392) - peek(M, trunc(peek(V, 389) + 3 + 0.00001)));\n      poke(V, t137, 393);\n      if ((abs((peek(V, 393) < 0 ? 1 : 0)) >= 0.00001)) {\n        t138 = peek(V, 391);\n        t139 = (peek(V, 393) + t138);\n        poke(V, t139, 393);\n      }\n      t140 = peek(M, trunc(peek(V, 390) + peek(V, 393) + 0.00001));\n      poke(V, t140, 394);\n      t141 = ((peek(M, trunc(peek(V, 389) + 4 + 0.00001)) * (peek(V, 394) - peek(M, trunc(peek(V, 389) + 6 + 0.00001)))) + peek(M, trunc(peek(V, 389) + 5 + 0.00001)));\n      poke(V, t141, 395);\n      t142 = trunc(peek(V, 389) + 5 + 0.00001);\n      t143 = peek(V, 394);\n      poke(M, t143, t142);\n      t144 = trunc(peek(V, 389) + 6 + 0.00001);\n      t145 = peek(V, 395);\n      poke(M, t145, t144);\n      t146 = ((peek(M, trunc(peek(V, 389) + 7 + 0.00001)) * peek(V, 395)) + (peek(M, trunc(peek(V, 389) + 8 + 0.00001)) * peek(M, trunc(peek(V, 389) + 9 + 0.00001))));\n      poke(V, t146, 395);\n      t147 = trunc(peek(V, 389) + 9 + 0.00001);\n      t148 = peek(V, 395);\n      poke(M, t148, t147);\n      t149 = peek(M, trunc(peek(V, 389) + 10 + 0.00001));\n      poke(V, t149, 396);\n      if ((abs((peek(V, 396) > 0 ? 1 : 0)) >= 0.00001)) {\n        t150 = peek(M, trunc(peek(V, 389) + 11 + 0.00001));\n        poke(V, t150, 397);\n        t151 = peek(M, trunc(peek(V, 389) + 12 + 0.00001));\n        poke(V, t151, 398);\n        t152 = (peek(M, trunc(peek(V, 389) + 13 + 0.00001)) + eel_mod(peek(V, 124), peek(V, 398)));\n        poke(V, t152, 399);\n        t153 = (2 * peek(V, 398));\n        poke(V, t153, 400);\n        t154 = min(1048576, trunc(peek(V, 396)));\n        for (t155 = 0; t155 < t154; t155 += 1) {\n          t156 = peek(M, trunc(peek(V, 399) + 0.00001));\n          poke(V, t156, 401);\n          t157 = peek(M, trunc(peek(V, 399) + peek(V, 398) + 0.00001));\n          poke(V, t157, 402);\n          t158 = ((peek(V, 397) * (peek(V, 395) - peek(V, 402))) + peek(V, 401));\n          poke(V, t158, 403);\n          t159 = trunc(peek(V, 399) + 0.00001);\n          t160 = peek(V, 395);\n          poke(M, t160, t159);\n          t161 = trunc(peek(V, 399) + peek(V, 398) + 0.00001);\n          t162 = peek(V, 403);\n          poke(M, t162, t161);\n          t163 = peek(V, 403);\n          poke(V, t163, 395);\n          t164 = peek(V, 400);\n          t165 = (peek(V, 399) + t164);\n          poke(V, t165, 399);\n        }\n      }\n      t166 = (peek(V, 395) * peek(M, trunc(peek(V, 389) + 15 + 0.00001)));\n      t167 = (peek(V, 377) + t166);\n      poke(V, t167, 377);\n      t168 = (peek(V, 395) * peek(M, trunc(peek(V, 389) + 16 + 0.00001)));\n      t169 = (peek(V, 376) + t168);\n      poke(V, t169, 376);\n      t170 = abs(peek(V, 395));\n      poke(V, t170, 404);\n      t171 = trunc(peek(V, 389) + 20 + 0.00001);\n      t172 = ((abs((peek(V, 404) > peek(M, trunc(peek(V, 389) + 20 + 0.00001)) ? 1 : 0)) >= 0.00001) ? peek(V, 404) : (peek(M, trunc(peek(V, 389) + 20 + 0.00001)) * 0.9995));\n      poke(M, t172, t171);\n      t173 = trunc(peek(V, 390) + peek(V, 392) + 0.00001);\n      t174 = (peek(V, 395) + (peek(V, 378) * peek(M, trunc(peek(V, 389) + 14 + 0.00001))));\n      poke(M, t174, t173);\n      t175 = (peek(V, 392) + 1);\n      poke(V, t175, 392);\n      if ((abs((peek(V, 392) >= peek(V, 391) ? 1 : 0)) >= 0.00001)) {\n        poke(V, 0, 392);\n      }\n      t176 = trunc(peek(V, 389) + 2 + 0.00001);\n      t177 = peek(V, 392);\n      poke(M, t177, t176);\n      t178 = peek(V, 85);\n      t179 = (peek(V, 389) + t178);\n      poke(V, t179, 389);\n    }\n    t180 = peek(V, 309);\n    t181 = (peek(V, 377) * t180);\n    poke(V, t181, 377);\n    t182 = peek(V, 309);\n    t183 = (peek(V, 376) * t182);\n    poke(V, t183, 376);\n  }\n  t184 = (0.5 * (peek(V, 377) + peek(V, 376)));\n  poke(V, t184, 405);\n  poke(V, 0, 406);\n  poke(V, 0, 407);\n  if ((abs((peek(V, 140) > 0 ? 1 : 0)) >= 0.00001)) {\n    t185 = (((((peek(V, 369) * peek(V, 145)) + (peek(V, 405) * peek(V, 149))) + ((peek(V, 408) * peek(V, 336)) * peek(V, 154))) + (peek(V, 375) * peek(V, 162))) + peek(V, 125));\n    poke(V, t185, 409);\n    t186 = peek(V, 410);\n    poke(V, t186, 411);\n    t187 = peek(V, 89);\n    poke(V, t187, 389);\n    t188 = min(1048576, trunc(peek(V, 140)));\n    for (t189 = 0; t189 < t188; t189 += 1) {\n      t190 = ((((peek(M, trunc(peek(V, 389) + 0.00001)) - (peek(V, 411) * peek(M, trunc(peek(V, 389) + 6 + 0.00001)))) * peek(M, trunc(peek(V, 389) + 2 + 0.00001))) - (peek(M, trunc(peek(V, 389) + 1 + 0.00001)) * peek(M, trunc(peek(V, 389) + 3 + 0.00001)))) + peek(V, 409));\n      poke(V, t190, 395);\n      t191 = trunc(peek(V, 389) + 3 + 0.00001);\n      t192 = peek(M, trunc(peek(V, 389) + 2 + 0.00001));\n      poke(M, t192, t191);\n      t193 = trunc(peek(V, 389) + 2 + 0.00001);\n      t194 = peek(V, 395);\n      poke(M, t194, t193);\n      t195 = (peek(V, 395) * peek(M, trunc(peek(V, 389) + 4 + 0.00001)));\n      t196 = (peek(V, 407) + t195);\n      poke(V, t196, 407);\n      t197 = (peek(V, 395) * peek(M, trunc(peek(V, 389) + 5 + 0.00001)));\n      t198 = (peek(V, 406) + t197);\n      poke(V, t198, 406);\n      t199 = peek(V, 88);\n      t200 = (peek(V, 389) + t199);\n      poke(V, t200, 389);\n    }\n    t201 = peek(V, 310);\n    t202 = (peek(V, 407) * t201);\n    poke(V, t202, 407);\n    t203 = peek(V, 310);\n    t204 = (peek(V, 406) * t203);\n    poke(V, t204, 406);\n  }\n  t205 = (0.5 * (peek(V, 407) + peek(V, 406)));\n  poke(V, t205, 412);\n  if ((abs((peek(V, 166) > 0 ? 1 : 0)) >= 0.00001)) {\n    t206 = abs(peek(V, 412));\n    poke(V, t206, 413);\n    t207 = ((abs((peek(V, 413) > peek(V, 414) ? 1 : 0)) >= 0.00001) ? peek(V, 413) : (peek(V, 414) * peek(V, 325)));\n    poke(V, t207, 414);\n    t208 = min(0.06, (peek(V, 339) * peek(V, 414)));\n    poke(V, t208, 410);\n  }\n  if ((abs((peek(V, 165) > 0 ? 1 : 0)) >= 0.00001)) {\n    t209 = ((peek(V, 412) * peek(V, 412)) * peek(V, 338));\n    poke(V, t209, 415);\n    t210 = (0.995 * ((peek(V, 416) + peek(V, 415)) - peek(V, 417)));\n    poke(V, t210, 416);\n    t211 = peek(V, 415);\n    poke(V, t211, 417);\n  }\n  poke(V, 0, 418);\n  poke(V, 0, 419);\n  if ((abs(peek(V, 141)) >= 0.00001)) {\n    t212 = ((((((peek(V, 369) * peek(V, 144)) + (peek(V, 405) * peek(V, 148))) + (peek(V, 412) * peek(V, 147))) + peek(V, 416)) + (peek(V, 375) * peek(V, 163))) + peek(V, 125));\n    poke(V, t212, 420);\n    t213 = (peek(V, 316) * ((peek(V, 421) + peek(V, 420)) - peek(V, 422)));\n    poke(V, t213, 421);\n    t214 = peek(V, 420);\n    poke(V, t214, 422);\n    t215 = peek(V, 421);\n    poke(V, t215, 420);\n    t216 = (peek(V, 372) * peek(V, 144));\n    poke(V, t216, 423);\n    t217 = peek(V, 91);\n    poke(V, t217, 424);\n    poke(V, 0, 106);\n    t218 = min(1048576, trunc(8));\n    for (t219 = 0; t219 < t218; t219 += 1) {\n      t220 = peek(M, trunc(peek(V, 424) + 0.00001));\n      poke(V, t220, 390);\n      t221 = (peek(M, trunc(peek(V, 424) + 2 + 0.00001)) - peek(M, trunc(peek(V, 424) + 3 + 0.00001)));\n      poke(V, t221, 393);\n      if ((abs((peek(V, 393) < 0 ? 1 : 0)) >= 0.00001)) {\n        t222 = peek(M, trunc(peek(V, 424) + 1 + 0.00001));\n        t223 = (peek(V, 393) + t222);\n        poke(V, t223, 393);\n      }\n      t224 = peek(M, trunc(peek(V, 390) + peek(V, 393) + 0.00001));\n      poke(V, t224, 395);\n      t225 = ((peek(M, trunc(peek(V, 424) + 4 + 0.00001)) * peek(V, 395)) + (peek(M, trunc(peek(V, 424) + 5 + 0.00001)) * peek(M, trunc(peek(V, 424) + 6 + 0.00001))));\n      poke(V, t225, 395);\n      t226 = trunc(peek(V, 424) + 6 + 0.00001);\n      t227 = peek(V, 395);\n      poke(M, t227, t226);\n      t228 = peek(M, trunc(peek(V, 424) + 7 + 0.00001));\n      poke(V, t228, 396);\n      if ((abs((peek(V, 396) > 0 ? 1 : 0)) >= 0.00001)) {\n        t229 = peek(M, trunc(peek(V, 424) + 8 + 0.00001));\n        poke(V, t229, 397);\n        t230 = peek(M, trunc(peek(V, 424) + 9 + 0.00001));\n        poke(V, t230, 399);\n        t231 = min(1048576, trunc(peek(V, 396)));\n        for (t232 = 0; t232 < t231; t232 += 1) {\n          t233 = peek(M, trunc(peek(V, 399) + 0.00001));\n          poke(V, t233, 401);\n          t234 = peek(M, trunc(peek(V, 399) + 1 + 0.00001));\n          poke(V, t234, 402);\n          t235 = ((peek(V, 397) * (peek(V, 395) - peek(V, 402))) + peek(V, 401));\n          poke(V, t235, 403);\n          t236 = trunc(peek(V, 399) + 0.00001);\n          t237 = peek(V, 395);\n          poke(M, t237, t236);\n          t238 = trunc(peek(V, 399) + 1 + 0.00001);\n          t239 = peek(V, 403);\n          poke(M, t239, t238);\n          t240 = peek(V, 403);\n          poke(V, t240, 395);\n          t241 = (peek(V, 399) + 2);\n          poke(V, t241, 399);\n        }\n      }\n      t242 = trunc(peek(V, 92) + peek(V, 106) + 0.00001);\n      t243 = peek(V, 395);\n      poke(M, t243, t242);\n      t244 = peek(V, 90);\n      t245 = (peek(V, 424) + t244);\n      poke(V, t245, 424);\n      t246 = (peek(V, 106) + 1);\n      poke(V, t246, 106);\n    }\n    t247 = peek(M, trunc(peek(V, 92) + 0.00001));\n    poke(V, t247, 425);\n    t248 = peek(M, trunc(peek(V, 92) + 1 + 0.00001));\n    poke(V, t248, 426);\n    t249 = peek(M, trunc(peek(V, 92) + 2 + 0.00001));\n    poke(V, t249, 427);\n    t250 = peek(M, trunc(peek(V, 92) + 3 + 0.00001));\n    poke(V, t250, 428);\n    t251 = peek(M, trunc(peek(V, 92) + 4 + 0.00001));\n    poke(V, t251, 429);\n    t252 = peek(M, trunc(peek(V, 92) + 5 + 0.00001));\n    poke(V, t252, 430);\n    t253 = peek(M, trunc(peek(V, 92) + 6 + 0.00001));\n    poke(V, t253, 431);\n    t254 = peek(M, trunc(peek(V, 92) + 7 + 0.00001));\n    poke(V, t254, 432);\n    t255 = ((((((((peek(V, 425) - peek(V, 426)) + peek(V, 427)) - peek(V, 428)) + peek(V, 429)) - peek(V, 430)) + peek(V, 431)) - peek(V, 432)) * 0.35355339);\n    poke(V, t255, 419);\n    t256 = ((((((((peek(V, 425) + peek(V, 426)) - peek(V, 427)) - peek(V, 428)) + peek(V, 429)) + peek(V, 430)) - peek(V, 431)) - peek(V, 432)) * 0.35355339);\n    poke(V, t256, 418);\n    t257 = (peek(V, 425) + peek(V, 426));\n    poke(V, t257, 433);\n    t258 = (peek(V, 425) - peek(V, 426));\n    poke(V, t258, 434);\n    t259 = (peek(V, 427) + peek(V, 428));\n    poke(V, t259, 435);\n    t260 = (peek(V, 427) - peek(V, 428));\n    poke(V, t260, 436);\n    t261 = (peek(V, 429) + peek(V, 430));\n    poke(V, t261, 437);\n    t262 = (peek(V, 429) - peek(V, 430));\n    poke(V, t262, 438);\n    t263 = (peek(V, 431) + peek(V, 432));\n    poke(V, t263, 439);\n    t264 = (peek(V, 431) - peek(V, 432));\n    poke(V, t264, 440);\n    t265 = (peek(V, 433) + peek(V, 435));\n    poke(V, t265, 441);\n    t266 = (peek(V, 433) - peek(V, 435));\n    poke(V, t266, 442);\n    t267 = (peek(V, 434) + peek(V, 436));\n    poke(V, t267, 443);\n    t268 = (peek(V, 434) - peek(V, 436));\n    poke(V, t268, 444);\n    t269 = (peek(V, 437) + peek(V, 439));\n    poke(V, t269, 445);\n    t270 = (peek(V, 437) - peek(V, 439));\n    poke(V, t270, 446);\n    t271 = (peek(V, 438) + peek(V, 440));\n    poke(V, t271, 447);\n    t272 = (peek(V, 438) - peek(V, 440));\n    poke(V, t272, 448);\n    t273 = trunc(peek(V, 92) + 0.00001);\n    t274 = (peek(V, 441) + peek(V, 445));\n    poke(M, t274, t273);\n    t275 = trunc(peek(V, 92) + 4 + 0.00001);\n    t276 = (peek(V, 441) - peek(V, 445));\n    poke(M, t276, t275);\n    t277 = trunc(peek(V, 92) + 1 + 0.00001);\n    t278 = (peek(V, 443) + peek(V, 447));\n    poke(M, t278, t277);\n    t279 = trunc(peek(V, 92) + 5 + 0.00001);\n    t280 = (peek(V, 443) - peek(V, 447));\n    poke(M, t280, t279);\n    t281 = trunc(peek(V, 92) + 2 + 0.00001);\n    t282 = (peek(V, 442) + peek(V, 446));\n    poke(M, t282, t281);\n    t283 = trunc(peek(V, 92) + 6 + 0.00001);\n    t284 = (peek(V, 442) - peek(V, 446));\n    poke(M, t284, t283);\n    t285 = trunc(peek(V, 92) + 3 + 0.00001);\n    t286 = (peek(V, 444) + peek(V, 448));\n    poke(M, t286, t285);\n    t287 = trunc(peek(V, 92) + 7 + 0.00001);\n    t288 = (peek(V, 444) - peek(V, 448));\n    poke(M, t288, t287);\n    t289 = (peek(V, 420) * 0.35355339);\n    poke(V, t289, 420);\n    t290 = (peek(V, 423) * 0.35355339);\n    poke(V, t290, 423);\n    t291 = peek(V, 91);\n    poke(V, t291, 424);\n    poke(V, 0, 106);\n    t292 = min(1048576, trunc(8));\n    for (t293 = 0; t293 < t292; t293 += 1) {\n      t294 = peek(M, trunc(peek(V, 424) + 0.00001));\n      poke(V, t294, 390);\n      t295 = peek(M, trunc(peek(V, 424) + 2 + 0.00001));\n      poke(V, t295, 392);\n      t296 = trunc(peek(V, 390) + peek(V, 392) + 0.00001);\n      t297 = (((peek(M, trunc(peek(V, 92) + peek(V, 106) + 0.00001)) * 0.35355339) + (peek(V, 420) * peek(M, trunc(peek(V, 93) + peek(V, 106) + 0.00001)))) + (peek(V, 423) * peek(M, trunc(peek(V, 93) + (8 + peek(V, 106)) + 0.00001))));\n      poke(M, t297, t296);\n      t298 = (peek(V, 392) + 1);\n      poke(V, t298, 392);\n      if ((abs((peek(V, 392) >= peek(M, trunc(peek(V, 424) + 1 + 0.00001)) ? 1 : 0)) >= 0.00001)) {\n        poke(V, 0, 392);\n      }\n      t299 = trunc(peek(V, 424) + 2 + 0.00001);\n      t300 = peek(V, 392);\n      poke(M, t300, t299);\n      t301 = peek(V, 90);\n      t302 = (peek(V, 424) + t301);\n      poke(V, t302, 424);\n      t303 = (peek(V, 106) + 1);\n      poke(V, t303, 106);\n    }\n    t304 = peek(V, 312);\n    t305 = (peek(V, 419) * t304);\n    poke(V, t305, 419);\n    t306 = peek(V, 312);\n    t307 = (peek(V, 418) * t306);\n    poke(V, t307, 418);\n  }\n  t308 = (0.5 * (peek(V, 419) + peek(V, 418)));\n  poke(V, t308, 449);\n  if ((abs((peek(V, 158) > 0 ? 1 : 0)) >= 0.00001)) {\n    t309 = ((((peek(V, 405) * peek(V, 157)) + (peek(V, 449) * peek(V, 156))) + (peek(V, 412) * peek(V, 155))) * peek(V, 335));\n    poke(V, t309, 450);\n    t310 = (peek(V, 450) - max((-1), min(1, peek(V, 450))));\n    poke(V, t310, 451);\n    t311 = (peek(V, 319) * ((peek(V, 408) + peek(V, 451)) - peek(V, 452)));\n    poke(V, t311, 408);\n    t312 = peek(V, 451);\n    poke(V, t312, 452);\n  }\n  else {\n    poke(V, 0, 408);\n  }\n  t313 = (((peek(V, 408) * peek(V, 336)) * peek(V, 153)) + (peek(V, 375) * peek(V, 161)));\n  poke(V, t313, 453);\n  t314 = ((((peek(V, 377) * peek(V, 152)) + (peek(V, 407) * peek(V, 151))) + (peek(V, 419) * peek(V, 150))) + peek(V, 453));\n  poke(V, t314, 454);\n  t315 = ((((peek(V, 376) * peek(V, 152)) + (peek(V, 406) * peek(V, 151))) + (peek(V, 418) * peek(V, 150))) + peek(V, 453));\n  poke(V, t315, 455);\n  t316 = (peek(V, 317) * ((peek(V, 456) + peek(V, 454)) - peek(V, 457)));\n  poke(V, t316, 456);\n  t317 = peek(V, 454);\n  poke(V, t317, 457);\n  t318 = peek(V, 456);\n  poke(V, t318, 454);\n  t319 = (peek(V, 317) * ((peek(V, 458) + peek(V, 455)) - peek(V, 459)));\n  poke(V, t319, 458);\n  t320 = peek(V, 455);\n  poke(V, t320, 459);\n  t321 = peek(V, 458);\n  poke(V, t321, 455);\n  t322 = (peek(V, 318) * (peek(V, 454) - peek(V, 460)));\n  t323 = (peek(V, 460) + t322);\n  poke(V, t323, 460);\n  t324 = peek(V, 460);\n  poke(V, t324, 454);\n  t325 = (peek(V, 318) * (peek(V, 455) - peek(V, 461)));\n  t326 = (peek(V, 461) + t325);\n  poke(V, t326, 461);\n  t327 = peek(V, 461);\n  poke(V, t327, 455);\n  if ((abs(peek(V, 344)) >= 0.00001)) {\n    t328 = (peek(V, 112) + 5);\n    poke(V, t328, 462);\n    t329 = (((((peek(M, trunc(peek(V, 462) + 0.00001)) * peek(V, 454)) + (peek(M, trunc(peek(V, 462) + 1 + 0.00001)) * peek(V, 463))) + (peek(M, trunc(peek(V, 462) + 2 + 0.00001)) * peek(V, 464))) - (peek(M, trunc(peek(V, 462) + 3 + 0.00001)) * peek(V, 465))) - (peek(M, trunc(peek(V, 462) + 4 + 0.00001)) * peek(V, 466)));\n    poke(V, t329, 467);\n    t330 = peek(V, 463);\n    poke(V, t330, 464);\n    t331 = peek(V, 454);\n    poke(V, t331, 463);\n    t332 = peek(V, 465);\n    poke(V, t332, 466);\n    t333 = peek(V, 467);\n    poke(V, t333, 465);\n    t334 = peek(V, 467);\n    poke(V, t334, 454);\n    t335 = (((((peek(M, trunc(peek(V, 462) + 0.00001)) * peek(V, 455)) + (peek(M, trunc(peek(V, 462) + 1 + 0.00001)) * peek(V, 468))) + (peek(M, trunc(peek(V, 462) + 2 + 0.00001)) * peek(V, 469))) - (peek(M, trunc(peek(V, 462) + 3 + 0.00001)) * peek(V, 470))) - (peek(M, trunc(peek(V, 462) + 4 + 0.00001)) * peek(V, 471)));\n    poke(V, t335, 467);\n    t336 = peek(V, 468);\n    poke(V, t336, 469);\n    t337 = peek(V, 455);\n    poke(V, t337, 468);\n    t338 = peek(V, 470);\n    poke(V, t338, 471);\n    t339 = peek(V, 467);\n    poke(V, t339, 470);\n    t340 = peek(V, 467);\n    poke(V, t340, 455);\n  }\n  if ((abs(peek(V, 345)) >= 0.00001)) {\n    t341 = (peek(V, 112) + 10);\n    poke(V, t341, 462);\n    t342 = (((((peek(M, trunc(peek(V, 462) + 0.00001)) * peek(V, 454)) + (peek(M, trunc(peek(V, 462) + 1 + 0.00001)) * peek(V, 472))) + (peek(M, trunc(peek(V, 462) + 2 + 0.00001)) * peek(V, 473))) - (peek(M, trunc(peek(V, 462) + 3 + 0.00001)) * peek(V, 474))) - (peek(M, trunc(peek(V, 462) + 4 + 0.00001)) * peek(V, 475)));\n    poke(V, t342, 467);\n    t343 = peek(V, 472);\n    poke(V, t343, 473);\n    t344 = peek(V, 454);\n    poke(V, t344, 472);\n    t345 = peek(V, 474);\n    poke(V, t345, 475);\n    t346 = peek(V, 467);\n    poke(V, t346, 474);\n    t347 = peek(V, 467);\n    poke(V, t347, 454);\n    t348 = (((((peek(M, trunc(peek(V, 462) + 0.00001)) * peek(V, 455)) + (peek(M, trunc(peek(V, 462) + 1 + 0.00001)) * peek(V, 476))) + (peek(M, trunc(peek(V, 462) + 2 + 0.00001)) * peek(V, 477))) - (peek(M, trunc(peek(V, 462) + 3 + 0.00001)) * peek(V, 478))) - (peek(M, trunc(peek(V, 462) + 4 + 0.00001)) * peek(V, 479)));\n    poke(V, t348, 467);\n    t349 = peek(V, 476);\n    poke(V, t349, 477);\n    t350 = peek(V, 455);\n    poke(V, t350, 476);\n    t351 = peek(V, 478);\n    poke(V, t351, 479);\n    t352 = peek(V, 467);\n    poke(V, t352, 478);\n    t353 = peek(V, 467);\n    poke(V, t353, 455);\n  }\n  t354 = ((0.5 * (peek(V, 454) + peek(V, 455))) * peek(V, 324));\n  poke(V, t354, 480);\n  t355 = (((0.5 * (peek(V, 454) - peek(V, 455))) * peek(V, 349)) * peek(V, 324));\n  poke(V, t355, 481);\n  t356 = (peek(V, 480) + peek(V, 481));\n  poke(V, t356, 454);\n  t357 = (peek(V, 480) - peek(V, 481));\n  poke(V, t357, 455);\n  t358 = abs(peek(V, 454));\n  poke(V, t358, 482);\n  if ((abs((peek(V, 482) > 0.9 ? 1 : 0)) >= 0.00001)) {\n    t359 = (peek(V, 482) - 0.9);\n    poke(V, t359, 483);\n    t360 = peek(V, 454);\n    t361 = ((t360 > 0 ? 1 : (t360 < 0 ? -1 : 0)) * (0.9 + ((0.1 * peek(V, 483)) / (0.1 + peek(V, 483)))));\n    poke(V, t361, 454);\n  }\n  t362 = abs(peek(V, 455));\n  poke(V, t362, 482);\n  if ((abs((peek(V, 482) > 0.9 ? 1 : 0)) >= 0.00001)) {\n    t363 = (peek(V, 482) - 0.9);\n    poke(V, t363, 483);\n    t364 = peek(V, 455);\n    t365 = ((t364 > 0 ? 1 : (t364 < 0 ? -1 : 0)) * (0.9 + ((0.1 * peek(V, 483)) / (0.1 + peek(V, 483)))));\n    poke(V, t365, 455);\n  }\n  t366 = (((peek(V, 359) * peek(V, 347)) + (peek(V, 454) * peek(V, 346))) * peek(V, 348));\n  poke(V, t366, 357);\n  t367 = (((peek(V, 360) * peek(V, 347)) + (peek(V, 455) * peek(V, 346))) * peek(V, 348));\n  poke(V, t367, 358);\n  t368 = abs(peek(V, 454));\n  poke(V, t368, 482);\n  t369 = ((abs((peek(V, 482) > peek(V, 484) ? 1 : 0)) >= 0.00001) ? peek(V, 482) : (peek(V, 484) * peek(V, 356)));\n  poke(V, t369, 484);\n  t370 = abs(peek(V, 455));\n  poke(V, t370, 482);\n  t371 = ((abs((peek(V, 482) > peek(V, 485) ? 1 : 0)) >= 0.00001) ? peek(V, 482) : (peek(V, 485) * peek(V, 356)));\n  poke(V, t371, 485);\n  t372 = abs(peek(V, 449));\n  poke(V, t372, 482);\n  t373 = ((abs((peek(V, 482) > peek(V, 486) ? 1 : 0)) >= 0.00001) ? peek(V, 482) : (peek(V, 486) * peek(V, 356)));\n  poke(V, t373, 486);\nout1 = peek(V, 357);\nout2 = peek(V, 358);\n",
         "fontface": 0,
         "fontname": "<Monospaced>",
         "fontsize": 12.0
        }
       },
       {
        "box": {
         "id": "obj-4",
         "maxclass": "newobj",
         "numinlets": 1,
         "numoutlets": 0,
         "patching_rect": [
          20.0,
          520.0,
          40.0,
          22.0
         ],
         "text": "out 1"
        }
       },
       {
        "box": {
         "id": "obj-5",
         "maxclass": "newobj",
         "numinlets": 1,
         "numoutlets": 0,
         "patching_rect": [
          140.0,
          520.0,
          40.0,
          22.0
         ],
         "text": "out 2"
        }
       }
      ],
      "lines": [
       {
        "patchline": {
         "source": [
          "obj-1",
          0
         ],
         "destination": [
          "obj-3",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-2",
          0
         ],
         "destination": [
          "obj-3",
          1
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-3",
          0
         ],
         "destination": [
          "obj-4",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "obj-3",
          1
         ],
         "destination": [
          "obj-5",
          0
         ]
        }
       }
      ]
     }
    }
   },
   {
    "box": {
     "id": "obj-14",
     "maxclass": "newobj",
     "numinlets": 2,
     "numoutlets": 0,
     "patching_rect": [
      20.0,
      360.0,
      70.0,
      22.0
     ],
     "text": "plugout~"
    }
   },
   {
    "box": {
     "id": "obj-15",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 2,
     "patching_rect": [
      220.0,
      260.0,
      60.0,
      22.0
     ],
     "outlettype": [
      "signal",
      "signal"
     ],
     "text": "plugin~"
    }
   },
   {
    "box": {
     "id": "obj-16",
     "maxclass": "newobj",
     "numinlets": 1,
     "numoutlets": 2,
     "patching_rect": [
      420.0,
      300.0,
      160.0,
      22.0
     ],
     "outlettype": [
      "",
      ""
     ],
     "text": "buffer~ ---mq @samps 1024"
    }
   },
   {
    "box": {
     "id": "obj-17",
     "maxclass": "message",
     "numinlets": 1,
     "numoutlets": 1,
     "patching_rect": [
      420.0,
      260.0,
      200.0,
      22.0
     ],
     "outlettype": [
      ""
     ],
     "text": "mqname ---mq"
    }
   },
   {
    "box": {
     "id": "obj-18",
     "maxclass": "message",
     "numinlets": 1,
     "numoutlets": 1,
     "patching_rect": [
      220.0,
      220.0,
      100.0,
      22.0
     ],
     "outlettype": [
      ""
     ],
     "text": "mq ---mq"
    }
   }
  ],
  "lines": [
   {
    "patchline": {
     "source": [
      "obj-1",
      0
     ],
     "destination": [
      "obj-3",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-2",
      0
     ],
     "destination": [
      "obj-3",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-3",
      0
     ],
     "destination": [
      "obj-4",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-3",
      1
     ],
     "destination": [
      "obj-5",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-5",
      0
     ],
     "destination": [
      "obj-6",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-6",
      0
     ],
     "destination": [
      "obj-3",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-3",
      2
     ],
     "destination": [
      "obj-7",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-8",
      0
     ],
     "destination": [
      "obj-9",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-9",
      0
     ],
     "destination": [
      "obj-10",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-9",
      1
     ],
     "destination": [
      "obj-10",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-10",
      0
     ],
     "destination": [
      "obj-11",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-11",
      0
     ],
     "destination": [
      "obj-12",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-12",
      0
     ],
     "destination": [
      "obj-3",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-13",
      0
     ],
     "destination": [
      "obj-14",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-13",
      1
     ],
     "destination": [
      "obj-14",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-15",
      0
     ],
     "destination": [
      "obj-13",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-15",
      1
     ],
     "destination": [
      "obj-13",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-3",
      3
     ],
     "destination": [
      "obj-13",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-2",
      0
     ],
     "destination": [
      "obj-17",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-17",
      0
     ],
     "destination": [
      "obj-3",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-2",
      0
     ],
     "destination": [
      "obj-18",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "obj-18",
      0
     ],
     "destination": [
      "obj-13",
      0
     ]
    }
   }
  ],
  "parameters": {
   "obj-5": [
    "state",
    "state",
    0
   ],
   "inherited_shortname": 1
  },
  "dependency_cache": [
   {
    "name": "Reverberator.js",
    "bootpath": ".",
    "type": "TEXT",
    "implicit": 1
   }
  ],
  "autosave": 0,
  "devicewidth": 260.0,
  "description": "",
  "digest": "",
  "tags": "",
  "style": "",
  "latency": 0,
  "is_mpe": 0
 }
}
