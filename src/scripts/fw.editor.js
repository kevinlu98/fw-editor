import CodeMirror from 'codemirror'

// 代码高亮
import 'codemirror/mode/markdown/markdown'

// 代码收缩
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/markdown-fold'
import 'codemirror/addon/fold/brace-fold'
// 标签匹配与编辑配置
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchtags'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/continuelist'
import 'codemirror/addon/edit/trailingspace'

// 快捷键
import 'codemirror/keymap/sublime'
// 搜索
import 'codemirror/addon/search/search'
import 'codemirror/addon/dialog/dialog.css'
// 其它
import 'codemirror/addon/selection/active-line'
import 'codemirror/keymap/sublime'
//主题样式
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-palenight.css'

//全屏
import 'codemirror/addon/display/fullscreen'
import 'codemirror/addon/display/fullscreen.css'

const marked = require('marked')
const hljs = require('highlight.js')

import layer from 'layui-layer'


// 自定义样式
import '../css/style.css'
import '../css/a11y-light.css'

import editorTools from './fw.editor.tools'

import './date.extend'


const mac = CodeMirror.keyMap.default === CodeMirror.keyMap.macDefault
const runKey = mac ? 'Cmd' : 'Ctrl'

export class Editor {
    static languages = ['Bash',
        'C',
        'C#',
        'C++',
        'CSS',
        'Diff',
        'Go',
        'HTML',
        'XML',
        'JSON',
        'Java',
        'JavaScript',
        'Kotlin',
        'Less',
        'Lua',
        'Makefile',
        'Markdown',
        'Objective-C',
        'PHP',
        'PHP Template',
        'Perl',
        'Plain text',
        'Python',
        'Python REPL',
        'R',
        'Ruby',
        'Rust',
        'SCSS',
        'SQL',
        'Shell Session',
        'Swift',
        'TOML',
        'INI',
        'TypeScript',
        'Visual Basic',
        '.NET',
        'YAML'
    ]

    watch = false

    menu_all = {
        undo: {
            icon: '<svg t="1639554246587" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1106" data-spm-anchor-id="a313x.7781069.0.i1" width="200" height="200"><path d="M640 192H320V64L100 240l220 176V288h320c123.71 0 224 100.29 224 224S763.71 736 640 736H512v96h128c176.73 0 320-143.27 320-320S816.73 192 640 192z" p-id="1107" fill="#ABB2BF"></path></svg>',
            call: () => {
                this.cm.undo()
            }
        },
        redo: {
            icon: '<svg t="1639554404324" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1434" width="200" height="200"><path d="M384 192h320V64l220 176-220 176V288H384c-123.71 0-224 100.29-224 224s100.29 224 224 224h128v96H384C207.27 832 64 688.73 64 512s143.27-320 320-320z" p-id="1435" fill="#ABB2BF"></path></svg>',
            call: () => {
                this.cm.redo()
            }
        },
        bold: {
            icon: '<svg t="1639554440278" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1621" width="200" height="200"><path d="M711.86 458.24C746.89 416.53 768 362.73 768 304c0-132.55-107.45-240-240-240H256v896h384c141.38 0 256-114.61 256-256 0-116.43-77.74-214.7-184.14-245.76zM352 160h176c79.53 0 144 64.47 144 144s-64.47 144-144 144H352V160z m448 544c0 88.37-71.63 160-160 160H352V544h288c88.37 0 160 71.63 160 160z" p-id="1622" fill="#ABB2BF"></path></svg>',
            call: () => {
                editorTools.handleTextStyle(this.cm, '**')
            }
        },
        italic: {
            icon: '<svg t="1639554487639" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1852" width="200" height="200"><path d="M832 160V64H384v96h172.62L367.99 864H192v96h448v-96H467.38l188.63-704z" p-id="1853" fill="#ABB2BF"></path></svg>',
            call: () => {
                editorTools.handleTextStyle(this.cm, '*')
            }
        },
        strikethrough: {
            icon: '<svg t="1639554605102" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2039" width="200" height="200"><path d="M960 448H464c-79.53 0-144-64.47-144-144s64.47-144 144-144h96c62.7 0 116.03 40.07 135.79 96h99.4C772.96 146.45 676.11 64 560 64h-96c-132.55 0-240 107.45-240 240 0 54.03 17.86 103.89 47.99 144H64v96h512c88.37 0 160 71.63 160 160s-71.63 160-160 160H448c-64.07 0-119.33-37.66-144.88-92.04H201.14C230.91 880.35 330.15 960 448 960h128c141.38 0 256-114.61 256-256 0-60.55-21.03-116.17-56.17-160H960v-96z" p-id="2040" fill="#ABB2BF"></path></svg>',
            call: () => {
                editorTools.handleTextStyle(this.cm, '~~')
            }
        },
        separator: {
            icon: '<svg t="1639554776390" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1129" width="200" height="200"><path d="M85.333333 469.333333h85.333334v85.333334H85.333333v-85.333334z m170.666667 0h512v85.333334H256v-85.333334z m597.333333 0h85.333334v85.333334h-85.333334v-85.333334z" p-id="1130" fill="#ABB2BF"></path></svg>',
            call: () => {
                editorTools.handleLine(this.cm)
            }
        },
        linecode: {
            icon: '<svg t="1639554857108" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1342" width="200" height="200"><path d="M723.2 361.130667l60.330667-60.330667 211.2 211.2-211.2 211.2-60.330667-60.330667L874.026667 512 723.2 361.130667z m-422.4 0L149.973333 512l150.826667 150.869333-60.330667 60.330667L29.269333 512l211.2-211.2L300.8 361.130667z" p-id="1343" fill="#ABB2BF"></path></svg>',
            call: () => {
                editorTools.handleTextStyle(this.cm, '`')
            }
        },
        quote: {
            icon: '<svg t="1639554907503" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2226" width="200" height="200"><path d="M379.01 256L231.35 511.75l0.05 0.03c-10.97 18.88-17.26 40.81-17.26 64.22 0 70.69 57.31 128 128 128s128-57.31 128-128c0-58.85-39.72-108.42-93.81-123.37L489.86 256H379.01zM696.34 452.63L809.86 256H699.01L551.35 511.75l0.05 0.03c-10.97 18.88-17.26 40.81-17.26 64.22 0 70.69 57.31 128 128 128s128-57.31 128-128c0-58.85-39.71-108.42-93.8-123.37z" p-id="2227" fill="#ABB2BF"></path></svg>',
            call: () => {
                editorTools.handleUnorderedList(this.cm, '>')
            }
        },
        headline: {
            icon: '<svg t="1639555270873" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2413" width="200" height="200"><path d="M832.13 464H832V64h-96v400H288V64h-96v400h-0.04v96h0.04v400h96V560h448v400h96V560h0.13z" p-id="2414" fill="#ABB2BF"></path></svg>',
            call: () => {
                let _this = this
                if (!this.init) {
                    $(".fw-tool-bar .fw-menu-headline").append('<ul class="fw-menu-headlist" style="display: none"></ul>')
                    for (let i = 1; i <= 6; i++) {
                        $(".fw-menu-headline .fw-menu-headlist").append(`<li data-level="${i}">H${i}</li>`)
                    }
                    $('.fw-menu-headlist li').on('click', function () {
                        editorTools.handleTitle(_this.cm, $(this).data('level'))

                    })
                    this.init = true
                }
                if ($("ul.fw-menu-headlist").css('display') === 'none') {
                    $(".fw-menu-headlist").fadeIn()
                    $('.CodeMirror.CodeMirror-fullscreen').css('zIndex', '-9')
                } else {
                    $(".fw-menu-headlist").fadeOut()
                    $('.CodeMirror.CodeMirror-fullscreen').css('zIndex', '9')
                }

            }
        },
        orderlist: {
            icon: '<svg t="1639555328914" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2600" width="200" height="200"><path d="M256 464h704v96H256zM256 160h704v96H256zM256 768h704v96H256zM111.99 272h32V144h-64v32h32zM64 752v32h64v15.39H87.8v32H128V848H64v32h96V752h-32zM160 480v-32H64v32h50.75l-50.76 50.76 0.01 0.02V576h96v-32H96l64-64z" p-id="2601" fill="#ABB2BF"></path></svg>',
            call: () => {
                editorTools.handleOrderList(this.cm)
            }
        },
        unorderlist: {
            icon: '<svg t="1639555361738" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2787" width="200" height="200"><path d="M256 464h704v96H256zM256 160h704v96H256zM256 768h704v96H256zM64 160h96v96H64zM64 464h96v96H64zM64 768h96v96H64z" p-id="2788" fill="#ABB2BF"></path></svg>',
            call: () => {
                editorTools.handleUnorderedList(this.cm, '-')
            }
        },
        link: {
            icon: '<svg t="1639555409938" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1517" width="200" height="200"><path d="M783.530667 662.869333L723.2 602.453333l60.330667-60.330666a213.333333 213.333333 0 1 0-301.696-301.696L421.504 300.8 361.130667 240.469333 421.546667 180.138667a298.666667 298.666667 0 0 1 422.4 422.4l-60.373334 60.330666z m-120.661334 120.661334l-60.373333 60.330666a298.666667 298.666667 0 0 1-422.4-422.4l60.373333-60.330666L300.8 421.546667l-60.330667 60.330666a213.333333 213.333333 0 1 0 301.696 301.696l60.330667-60.330666 60.373333 60.330666z m-30.208-452.565334l60.373334 60.373334-301.696 301.653333-60.373334-60.330667 301.696-301.653333z" p-id="1518" fill="#ABB2BF"></path></svg>',
            call: () => {
                let content = `<div class="fw-layer-content">
                <div class="fw-form-item">
                <label>链接标题：</label>
                <input type="text" id="fw-link-input" value="${this.cm.getSelections()[0]}"  placeholder="请输入链接标题">
                </div>
                <div class="fw-form-item">
                <label>链接地址：</label>
                <input type="text" id="fw-url-input" placeholder="请输入链接地址">
                </div></div>
                `
                let idx = layer.open({
                    type: 1,
                    title: '插入链接',
                    btn: ['确定', '取消'],
                    content: content,
                    btn1: () => {
                        editorTools.handleLink(this.cm, $("#fw-link-input").val(), $("#fw-url-input").val())
                        layer.close(idx)
                    }
                })
            }
        },
        image: {
            icon: '<svg t="1639555477955" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2974" width="200" height="200"><path d="M64 128v768h896V128H64z m800 672H359.58l287.85-287.85L864 728.72V800z m0-207.05L647.43 376.38 223.81 800H160V224h704v368.95z" p-id="2975" fill="#ABB2BF"></path><path d="M320 384m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="2976" fill="#ABB2BF"></path></svg>',
            call: () => {
                let content = `<div class="fw-layer-content">
                <div class="fw-form-item">
                <label>图片名称：</label>
                <input type="text" id="fw-pic-input" value="${this.cm.getSelections()[0]}" placeholder="请输入图片名称...">
                </div>
                <div class="fw-form-item">
                <label>图片地址：</label>
                <input type="text" id="fw-url-input" placeholder="请输入图片地址...">
                </div></div>
                `
                let idx = layer.open({
                    type: 1,
                    title: '插入图片',
                    btn: ['确定', '取消'],
                    content: content,
                    btn1: () => {
                        editorTools.handleLink(this.cm, $("#fw-pic-input").val(), $("#fw-url-input").val(), true)
                        layer.close(idx)
                    }
                })
            }
        },
        table: {
            icon: '<svg t="1639556190717" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3162" width="200" height="200"><path d="M702.43 128H64v768h896V128H702.43z m-96 96v128H416V224h190.43z m0 224v128H416V448h190.43zM160 224h160v128H160V224z m0 224h160v128H160V448z m0 352V672h160v128H160z m256 0V672h190.43v128H416z m448 0H702.43V672H864v128z m0-224H702.43V448H864v128zM702.43 352V224H864v128H702.43z" p-id="3163" fill="#ABB2BF"></path></svg>',
            call: () => {
                let content = `<div class="fw-layer-content">
                <div class="fw-form-item">
                <label>表格行：</label>
                <input type="number" style="width: 70px;" id="fw-table-row" value="2"  >
                <label>表格列：</label>
                <input type="number" style="width: 70px;" id="fw-table-col" value="3">
                </div></div>
                `
                let idx = layer.open({
                    type: 1,
                    title: '插入表格',
                    btn: ['确定', '取消'],
                    content: content,
                    btn1: () => {
                        let text = '\n';
                        let row = parseInt($("#fw-table-row").val())
                        let col = parseInt($("#fw-table-col").val())
                        console.log(row, col)
                        for (let i = 0; i < row; i++) {
                            text += '|'
                            if (i === 0) {
                                for (let j = 0; j < col; j++) {
                                    text += ' 表头 |'
                                }
                                text += '\n|';
                                for (let j = 0; j < col; j++) {
                                    text += ' :--: |'
                                }
                            } else {
                                for (let j = 0; j < col; j++) {
                                    text += ' 表格 |'
                                }
                            }
                            text += '\n'
                        }
                        text += '\n'
                        this.cm.replaceSelection(text)
                        this.cm.focus()
                        layer.close(idx)
                    }
                })
            }
        },
        code: {
            icon: '<svg t="1639556238275" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3349" width="200" height="200"><path d="M230.29 224L64.01 512v0.01L230.29 800h110.85L174.86 512l166.28-288zM793.69 224H682.84l166.31 288.06L682.91 800h110.85L960 512.06zM385.14 800h99.38l154.34-576h-99.38z" p-id="3350" fill="#ABB2BF"></path></svg>',
            call: () => {
                let content = `<div class="fw-layer-content"><div class="fw-form-item"><label>代码语言：</label><select  id="fw-language">`
                for (let i = 0; i < Editor.languages.length; i++) {
                    content += `<option value="${Editor.languages[i]}">-- ${Editor.languages[i]} --</option>`
                }
                content += '</select></div></div>'
                let idx = layer.open({
                    type: 1,
                    title: '插入链接',
                    btn: ['确定', '取消'],
                    content: content,
                    btn1: () => {
                        let type = $("#fw-language").val()
                        let selector = this.cm.getSelections()[0]
                        this.cm.replaceSelection('```' + `${type}\n${selector}\n` + '```')
                        this.cm.focus()
                        // editorTools.handleLink(this.cm, $("#fw-link-input").val(), $("#fw-url-input").val())
                        layer.close(idx)
                    }

                })
            }
        },
        datetime: {
            icon: '<svg t="1639556332903" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8825" width="200" height="200"><path d="M512 1024C229.224296 1024 0 794.775704 0 512S229.224296 0 512 0 1024 229.224296 1024 512 794.775704 1024 512 1024z m0-942.535111C274.583704 81.464889 81.464889 274.583704 81.464889 512c0 237.416296 193.118815 430.535111 430.535111 430.535111 237.416296 0 430.535111-193.118815 430.535111-430.535111 0-237.416296-193.118815-430.535111-430.535111-430.535111z m147.493926 608.142222a40.580741 40.580741 0 0 1-28.785778-11.794963l-176.886518-177.455407v-273.445926c0-22.679704 18.052741-40.732444 40.732444-40.732445 22.679704 0 40.732444 18.052741 40.732445 40.732445v239.691852l152.993185 153.031111c16.308148 16.308148 16.308148 41.908148 0 58.17837a40.580741 40.580741 0 0 1-28.785778 11.794963z" fill="#ABB2BF" p-id="8826"></path></svg>',
            call: () => {
                this.cm.replaceSelection((new Date()).Format("yyyy年MM月dd日 hh:mm:ss"))
                this.cm.focus()
            }
        },
        fullscreen: {
            icon: '<svg t="1639557265793" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3679" width="200" height="200"><path d="M64 384h96V160h224.2V64H64zM639.8 64v96H864v224h96V64zM864 864H639.8v96H960V639.61h-96zM160 639.61H64V960h320.2v-96H160z" p-id="3680" fill="#ABB2BF"></path></svg>',
            call: () => {
                if (this.cm.getOption('fullScreen')) {
                    this.toolBar.removeClass('fullScreen')
                    this.cm.setOption('fullScreen', false)
                } else {
                    this.cm.setOption('fullScreen', true)
                    this.toolBar.addClass('fullScreen')
                }
                // let cnt = $('.CodeMirror');
                $('.CodeMirror').css('width', '100%')
                this.viewer.css('height', '0')
                this.viewer.hide()
                this.watch = false;
            }
        },
        views: {
            icon: '<svg t="1639575941967" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4201" width="200" height="200"><path d="M703.956003 63.996a31.998 31.998 0 1 1 0-63.996h186.932316C964.419724 0 1023.936004 59.51628 1023.936004 133.047685V319.980001a31.998 31.998 0 1 1-63.996 0V133.047685C959.940004 94.906068 929.029936 63.996 890.888319 63.996H703.956003z m255.984001 624.792951a31.998 31.998 0 1 1 63.996 0v202.099368C1023.936004 964.419724 964.419724 1023.936004 890.888319 1023.936004h-126.328104a31.998 31.998 0 1 1 0-63.996h126.328104c38.141616 0 69.051684-30.910068 69.051685-69.051685v-202.099368zM335.147053 959.940004a31.998 31.998 0 1 1 0 63.996H133.047685A133.047685 133.047685 0 0 1 0 890.888319V703.956003a31.998 31.998 0 1 1 63.996 0v186.932316C63.996 929.029936 94.906068 959.940004 133.047685 959.940004h202.099368zM63.996 319.980001a31.998 31.998 0 0 1-63.996 0V133.047685C0 59.51628 59.51628 0 133.047685 0H319.980001a31.998 31.998 0 0 1 0 63.996H133.047685C94.906068 63.996 63.996 94.906068 63.996 133.047685V319.980001zM511.968002 671.958003c109.625148 0 211.634773-56.892444 308.332729-175.989001C723.602775 376.872445 621.59315 319.980001 511.968002 319.980001c-109.625148 0-211.634773 56.892444-308.332729 175.989001C300.333229 615.065558 402.342854 671.958003 511.968002 671.958003z m0 63.996c-130.615837 0-249.968377-66.55584-357.993625-199.667521a63.996 63.996 0 0 1 0-80.63496C261.999625 322.539841 381.352165 255.984001 511.968002 255.984001c130.615837 0 249.968377 66.55584 357.993625 199.667521a63.996 63.996 0 0 1 0 80.63496C761.936379 669.398163 642.583839 735.954003 511.968002 735.954003z" fill="#ABB2BF" p-id="4202"></path><path d="M511.968002 575.964002a79.995 79.995 0 1 0 0-159.99A79.995 79.995 0 0 0 511.968002 575.964002z m0 63.996a143.991001 143.991001 0 1 1 0-287.982001A143.991001 143.991001 0 0 1 511.968002 639.960002z" fill="#ABB2BF" p-id="4203"></path></svg>',
            call: () => {
                let cnt = $('.CodeMirror');
                console.log(cnt.width(), this.toolBar.width() / 2 + 100)
                if (cnt.width() > this.toolBar.width() / 2 + 100) {
                    cnt.css('width', '50%')
                    this.viewer.css('height', cnt.height() + 'px')
                    this.viewer.show()
                    this.watch = true;
                    this.md2html(true)
                } else {
                    cnt.css('width', '100%')
                    this.viewer.css('height', '0')
                    this.viewer.hide()
                    this.watch = false;
                }
            }
        },
        help: {
            icon: '<svg t="1639556627808" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9806" width="200" height="200"><path d="M514.048 54.272q95.232 0 178.688 36.352t145.92 98.304 98.304 145.408 35.84 178.688-35.84 178.176-98.304 145.408-145.92 98.304-178.688 35.84-178.176-35.84-145.408-98.304-98.304-145.408-35.84-178.176 35.84-178.688 98.304-145.408 145.408-98.304 178.176-36.352zM515.072 826.368q26.624 0 44.544-17.92t17.92-43.52q0-26.624-17.92-44.544t-44.544-17.92-44.544 17.92-17.92 44.544q0 25.6 17.92 43.52t44.544 17.92zM567.296 574.464q-1.024-16.384 20.48-34.816t48.128-40.96 49.152-50.688 24.576-65.024q2.048-39.936-8.192-74.752t-33.792-59.904-60.928-39.936-87.552-14.848q-62.464 0-103.936 22.016t-67.072 53.248-35.84 64.512-9.216 55.808q1.024 26.624 16.896 38.912t34.304 12.8 33.792-10.24 15.36-31.232q0-12.288 7.68-30.208t20.992-34.304 32.256-27.648 42.496-11.264q46.08 0 73.728 23.04t25.6 57.856q0 17.408-10.24 32.256t-26.112 28.672-33.792 27.648-33.792 28.672-26.624 32.256-11.776 37.888l1.024 38.912q0 15.36 14.336 29.184t37.888 14.848q23.552-1.024 37.376-15.36t12.8-32.768l0-24.576z" p-id="9807" fill="#ABB2BF"></path></svg>',
            call: () => {
                let idx = layer.open({
                    type: 1,
                    title: '关于',
                    content: '<div style="padding: 10px;font-size: 14px;color: #777777;margin: 10px;"><ul style="list-style: none;padding: 0;margin: 0;">' +
                        '<li>编辑器更多功能正在开发中...</li>' +
                        '<li>编辑器为 <a target="_blank" href="https://kevinlu98.cn/">Mr丶冷文</a> 为 <a target="_blank" href="https://kevinlu98.cn/archives/27.html">Freewind主题</a> 开发</li>' +
                        '<li>编辑器源码Git地址: <a target="_blank" href="https://github.com/kevinlu98/fw-editor">传送门</a> ，欢迎大家参考</li>' +
                        '</ul></div>'
                })
            }
        }
    }

    settings = {}

    constructor(id = "", options = {}) {

        this.cm = CodeMirror.fromTextArea(document.getElementById(id), {
            mode: 'markdown',
            theme: 'material-palenight',
            tabSize: 4,
            lineNumbers: true, // 显示行号
            matchTags: {bothTags: true}, // 匹配标签
            matchBrackets: true, // 括号匹配
            lineWiseCopyCut: true,
            indentWithTabs: true,
            indentUnit: 4,
            lineWrapping: true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            autofocus: true,
            foldGutter: true,
            keyMap: 'sublime',
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            styleActiveLine: true,
            scrollPastEnd: true, // 在编辑器底部插入一个编辑器同等高度的空白
            continueComments: true,
            lint: false,
            selfContain: true,
            showReplace: false, // 是否显示replace
            highlightSelectionMatches: {
                showToken: true,
                annotateScrollbar: true,
            },
            hintOptions: {
                completeSingle: false,
                alignWithWord: false,
            },
            extraKeys: {
                Tab: (cm) => {
                    /**
                     * 处理策略
                     * 如果光标选中了任何值，整行缩进
                     * 如果当前光标所在编辑窗口为markdown，正常缩进
                     * 如果当前行光标左边的一个字符为空或者为tab或空格，进行缩进
                     * 如果当前光标所在编辑窗口为html，进行emmet扩展
                     * // 如果都不满足，按下tab触发自动补全（智能提示）
                     */
                    function indent() {
                        // const spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
                        cm.replaceSelection('\t', 'end', '+input')
                    }

                    if (cm.somethingSelected()) {
                        // 光标选中文本
                        cm.indentSelection('add') // 整行缩进
                    } else {
                        const cursor = cm.getCursor() // 获取焦点
                        const line = cursor.line // 获取光标所在行数
                        const ch = cursor.ch // 获取光标位置
                        if (ch === 0 || cm.getOption('mode') === 'text/md-mix') {
                            indent() // 为markdown
                        } else {
                            const value = cm.getLine(line) // 获取当前行文本
                            const front = value[ch - 1] // 获取光标前一字符
                            switch (front) { // 为空格，tab或其他特定字符
                                case '\t':
                                case '<':
                                case ' ':
                                case "'":
                                case '/':
                                    indent()
                                    return void 0
                            }
                            if (cm.getOption('mode') === 'text/html') {
                                // 为html
                                front === '>' && indent()
                                try {
                                    cm.execCommand('emmetExpandAbbreviation') // emmet扩展
                                } catch (err) {
                                    console.error(err)
                                }
                            } else {
                                indent()
                                // cm.showHint()
                            }
                        }
                    }
                },
                [`${runKey}-Enter`]: (cm) => {
                    // 引用，无序，有序列表延伸
                    let matchStr = ''
                    // 判断开头是'> '还是'- '还是'1. '开头
                    if (cm.somethingSelected()) {
                        const selectContent = cm.listSelections()[0] // 第一个选中的文本
                        let {anchor, head} = selectContent
                        // 选中文本时，光标要么在内容前，要么在内容后，需要判断前后位置
                        head.line >= anchor.line && head.sticky === 'before' && ([head, anchor] = [anchor, head])
                        let {line: preLine, ch: prePos} = head
                        const selectVal = cm.getSelection()
                        let preStr = cm.getRange({line: preLine, ch: 0}, head)
                        let preBlank = ''
                        if (/^( |\t)+/.test(preStr)) {
                            preBlank = preStr.match(/^( |\t)+/)[0]
                            preStr = preStr.trimLeft()
                        }
                        if (/^> /.test(preStr)) {
                            // 以'> '开头
                            matchStr = '> '
                            prePos && (matchStr = `\n${preBlank}${matchStr}${selectVal}\n`) && ++preLine
                            cm.replaceSelection(matchStr)
                            cm.setCursor({line: preLine, ch: matchStr.length})
                        } else if (/^- /.test(preStr)) {
                            // 以'- '开头
                            matchStr = '- '
                            prePos && (matchStr = `\n${preBlank}${matchStr}${selectVal}\n`) && ++preLine
                            cm.replaceSelection(matchStr)
                            cm.setCursor({line: preLine, ch: matchStr.length})
                        } else if (/^\d+(\.) /.test(preStr)) {
                            let preNumber = 0
                            if (/^\d+(\.) /.test(preStr)) {
                                // 是否以'数字. '开头，找出前面的数字
                                preNumber = Number.parseInt(preStr.match(/^\d+/)[0])
                            }
                            matchStr = `\n${preBlank}${preNumber + 1}. ${selectVal}\n`
                            cm.replaceSelection(matchStr)
                            cm.setCursor({line: preLine + 1, ch: matchStr.length - 2})
                        }
                    } else {
                        const cursor = cm.getCursor()
                        let {line: curLine, ch: curPos} = cursor // 获取光标位置
                        let preStr = cm.getRange({line: curLine, ch: 0}, cursor)
                        let preBlank = ''
                        if (/^( |\t)+/.test(preStr)) {
                            // 有序列表标识前也许会有空格或tab缩进
                            preBlank = preStr.match(/^( |\t)+/)[0]
                            preStr = preStr.trimLeft()
                        }
                        if (/^> /.test(preStr)) {
                            // 以'> '开头
                            matchStr = '> '
                            curPos && (matchStr = `\n${preBlank}${matchStr}\n`) && ++curLine
                            cm.replaceSelection(matchStr)
                            cm.setCursor({line: curLine, ch: matchStr.length})
                        } else if (/^- /.test(preStr)) {
                            // 以'- '开头
                            matchStr = '- '
                            curPos && (matchStr = `\n${preBlank}${matchStr}\n`) && ++curLine
                            cm.replaceSelection(matchStr)
                            cm.setCursor({line: curLine, ch: matchStr.length})
                        } else if (/^\d+(\.) /.test(preStr)) {
                            // 以'数字. '开头
                            let preNumber = 0
                            if (/^\d+(\.) /.test(preStr)) {
                                // 是否以'数字. '开头，找出前面的数字
                                preNumber = Number.parseInt(preStr.match(/^\d+/)[0])
                            }
                            matchStr = `\n${preBlank}${preNumber + 1}. `
                            cm.replaceSelection(matchStr)
                            cm.setCursor({line: curLine + 1, ch: matchStr.length - 1})
                        }
                    }
                    cm.focus()

                },
                [`${runKey}-B`]: (cm) => {
                    // 加粗
                    editorTools.handleTextStyle(cm, '**')
                },
                [`${runKey}-I`]: (cm) => {
                    // 倾斜
                    editorTools.handleTextStyle(cm, '*')
                },
                [`${runKey}-D`]: (cm) => {
                    // 删除
                    editorTools.handleTextStyle(cm, '~~')
                },
                [`${runKey}-.`]: (cm) => {
                    // 删除
                    editorTools.handleUnorderedList(cm, '>')
                },
            }
        })
        this.settings['height'] = options['height'] ? options['height'] : 500;
        this.settings['parse'] = options['parse'] ? options['parse'] : false;

        if (options['menuExt']) {
            let menuExt = Object.keys(options['menuExt']);

            for (let i = 0; i < menuExt.length; i++) {
                this.menu_all[menuExt[i]] = options['menuExt'][menuExt[i]]
            }
        }
        this.settings['menu'] = options['menu'] ? options['menu'] : Object.keys(this.menu_all)
        this.textarea = $(`#${id}`)
        this.textarea.after('<div class="fw-tool-bar"></div>')
        this.toolBar = $(".fw-tool-bar")
        this.lastmd = this.cm.getValue()
        this.cm.on('change', (e) => {
            e.save()
            this.md2html()
        })
        this.cm.on('scroll', () => {
            if (this.watch) {
                let scroll = this.cm.getScrollInfo()
                let rate = scroll['top'] / scroll['height']
                this.viewer.scrollTop(this.viewer[0].scrollHeight * rate)
            }

        })
        this.reoladToolBar()
        this.cm.setSize('auto', this.settings['height'] + 'px')
    }

    md2html(watch = false) {
        let md = this.cm.getValue()
        if (watch || (md !== this.lastmd)) {
            this.lastmd = md
            let ht = marked.parse(md)
            if (this.settings['parse']) {
                ht = this.settings.parse(ht)
            }
            if (watch || (ht !== this.viewer.html() && this.watch)) {
                this.viewer.html(ht)
                this.viewer.scrollTop(this.viewer[0].scrollHeight)
            }
        }
    }

    reoladToolBar() {
        this.toolBar.html('<div id="write"></div>')
        this.viewer = $("#write")
        for (let i = 0; i < this.settings['menu'].length; i++) {
            let menuItem = this.menu_all[this.settings['menu'][i]]
            this.toolBar.append(`<a class="fw-tool-item fw-menu-${this.settings['menu'][i]}" href="javascript:void(0)" >${menuItem['icon']}</a>`)
            this.toolBar.children(`.fw-tool-item.fw-menu-${this.settings['menu'][i]}`).on('click', menuItem['call'])
        }
    }
}