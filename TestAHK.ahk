#Requires AutoHotkey v2.0
#SingleInstance Force

;global
global ClickCount := 0

; ==================== 核心配置区 ====================
; 在这里添加你想控制的所有软件（一行一个）
TargetApps := [{ exe: "Spine.exe", class: "", title: "" },  ; Spine
{ exe: "ai.exe", class: "", title: "" },  ; 示例：以后加 PS
{ exe: "Godot.exe", class: "", title: "" }, ; 示例：以后加 PS
{ exe: "Unreal.exe", class: "", title: "" }, ; 示例：以后加 PS
{ exe: "Blender.exe", class: "", title: "" },  ; 示例：以后加 Blender
{ exe: "Photoshop.exe", class: "", title: "" }]  ; 示例：以后加 PS
; 继续加...

; ==================== 辅助函数 ====================

; 判断当前鼠标是否在任意目标软件的客户端区域内（最关键！）
MouseInTargetWindow() {
    MouseGetPos(, , &winID)
    if !winID
        return false

    ; 关键修复：v2 中用 WinGetMinMax 判断是否最小化（-1 = 最小化）
    if WinGetMinMax(winID) = -1  ; 最小化直接返回 false
        return false

    ; 获取客户端区域坐标和大小（最小化或隐藏时会抛异常，所以用 try）
    try {
        WinGetClientPos(&x, &y, &w, &h, winID)
        if (w <= 0 || h <= 0)   ; 某些情况下客户端宽高会是 0
            return false

        MouseGetPos(&mx, &my)
        mx -= x, my -= y        ; 转为相对客户端坐标

        if (mx >= 0 && my >= 0 && mx < w && my < h) {
            ; 额外保险：窗口必须真的存在且不是隐藏状态（极少数情况需要）
            if WinExist(winID)
                return true
        }
    }
    catch
        return false

    return false
}

; 判断当前激活窗口是否是我们目标软件（用于 #HotIf 太粗糙时备用）
IsTargetActive() {
    if !WinActive("A")
        return false
    exe := WinGetProcessName("A")
    for app in TargetApps
        if (exe = app.exe)
            return true
    return false
}

; 防止在输入框里误触发（你原来的函数优化版）
IsTyping() {
    ctrl := ControlGetFocus("A")
    if !ctrl
        return false
    classNN := ctrl
    if RegExMatch(classNN, "i)Edit|RichEdit|Scintilla|TEdit|TMemo|TRichEdit")
        return true
    ; 一些软件用自定义编辑器，再加个保险：如果有输入法光标
    if DllCall("GetGUIThreadInfo", "UInt", 0, "Ptr", guiInfo := Buffer(48, 0)) {
        focused := NumGet(guiInfo, 24, "UInt")
        if focused {
            WinGetClass(&class, "ahk_id " focused)
            if InStr(class, "Edit") || InStr(class, "RichEdit")
                return true
        }
    }
    return false
}

; ==================== 通用热键区块（核心！）===================
; 所有热键都写在这里，只在鼠标在目标窗口内且窗口未最小化时生效
#HotIf MouseInTargetWindow() && !WinActive("ahk_class #32770")  ; 排除对话框

#HotIf  ; 结束通用热键区

; ==================== 软件专属区块（可选，只有该软件激活时才生效）===================
; ==================== Spine 专属区块 ====================
#HotIf WinActive("ahk_exe Spine.exe")

; 中键 = 右键拖动平移（最简单最稳版）
MButton:: {
    if IsTyping() {
        Send("{Blind}{MButton down}")
    } else {
        Send("{Shift down}{RButton down}")
    }

    KeyWait("MButton")  ; 等待中键释放

    if IsTyping() {
        Send("{Blind}{MButton up}")
    } else {
        Send("{RButton up}{Shift up}")
    }
}

; Shift + 中键 = 更快平移（Spine 原生 Shift + 右键行为）
+MButton:: {
    if IsTyping() {
        Send("{Blind}{MButton down}")
    } else {
        Send("{Shift down}{RButton down}")
    }

    KeyWait("MButton")

    if IsTyping() {
        Send("{Blind}{MButton up}")
    } else {
        Send("{RButton up}{Shift up}")
    }
}

;=============================================================================
; 全局状态标志（只用一个变量，极简）
global ActiveTransform := ""  ; ""=无, "move"/"rotate"/"scale"/"shear"

; ========== G → 移动 (V) ==========
g:: StartTransform("move", "v")

; ========== R → 旋转 (C) ==========
r:: StartTransform("rotate", "c")

; ========== S → 缩放 (X) ==========
s:: StartTransform("scale", "x")

; ========== Z → 倾斜 (Z) ==========
z:: StartTransform("shear", "z")

; 统一入口函数（超级简洁）
StartTransform(mode, spineKey) {
    global ActiveTransform

    if IsTyping() {
        Send(spineKey)
        return
    }

    ; 如果上一个变换还在进行，先强制结束它（Blender 无缝切换核心！）
    if (ActiveTransform != "") {
        Send("{LButton up}")
        Sleep(10)  ; 保险起见
    }

    ; 激活 Spine 对应工具并立即开始拖动
    Send(spineKey)
    Sleep(20)          ; 关键！给 Spine 一点反应时间
    Send("{LButton down}")

    ActiveTransform := mode  ; 标记当前模式
}

; ========== 松开左键 = 确认变换（Blender 核心行为）==========
~LButton up::
{
    global ActiveTransform
    if (ActiveTransform != "") {
        Send("{LButton up}")     ; 确保真的松开
        ActiveTransform := ""    ; 清除状态，变换结束
    }
}

; ========== 右键或 Esc = 取消当前变换 ==========
~RButton::
~Esc::
{
    global ActiveTransform
    if (ActiveTransform != "") {
        Send("{LButton up}")     ; 强制结束拖动
        Send("{Esc}")            ; Spine 原生取消操作
        ActiveTransform := ""
    }
}

; ========== 可选：按任意 G/R/S/Z 之外的键，也结束当前变换（更 Blender）==========
; 如果你想更严格，像 Blender 那样只有按变换键才打断，可以删下面这行
*$a::
{
    global ActiveTransform
    if (ActiveTransform != "") {
        Send("{LButton up}")
        ActiveTransform := ""
    }
    Send(A_ThisHotkey)
}

; ==================================================
SetAndTab(value, skipTabs) {
    ; 跳过指定的 Tab 数量以到达目标属性框
    loop skipTabs {
        Send '{Tab}'
        Sleep(20) ; 短暂延迟确保 Tab 切换完成
    }

    ; 输入值，并按 Enter 确认
    Send value
    Send '{Enter}'
    Sleep(50) ; 确保 Spine 接收输入并更新模型
}

; ===============================================
; ========== Shift + D → 复制选中骨骼/图像/槽（不复制关键帧！完美等同 Blender Shift+D）==========
+d:: {
    if IsTyping() {
        return Send("+d")
    }

    ; Spine 原生复制 = Ctrl + D，但会连关键帧一起复制
    ; 我们用原生菜单方式只复制物体本身（不带动画）
    Send("!e")      ; Alt + E 打开 Edit 菜单
    Sleep(50)
    Send("d")       ; d = Duplicate（只复制物体，不带关键帧！）
}

; ========== X → 删除选中（完全等同 Blender X）==========
x:: {
    if IsTyping() {

        return Send("x")
    }

    Send("{Delete}")  ; Spine 原生删除就是 Delete 键
    ; 或者如果你喜欢弹出确认框：Send("!e{Down 2}{Enter}")  → Edit → Delete
}

; ========== Spine 独有工具 → Blender 肌肉记忆映射 ==========

; T → Pose 工具（Spine 原生 B = Pose）
t:: {
    if IsTyping() {
        return Send("t")
    }
    Send("b")       ; B = Pose Tool（选中骨骼后直接摆姿势）
}

; W → 权重工具（Spine 原生 G = Weights）
w:: {
    if IsTyping() {
        return Send("w")
    }
    Send("g")       ; G = Weights Tool
}

; E → 创建骨骼（Spine 原生 N = Create Bone）
e:: {
    if IsTyping() {
        return Send("e")
    }
    Send("n")       ; N = Create Tool → Bone
}

; ========== Numpad . → 视图居中到选中物体（Blender 灵魂级操作）==========
NumpadDot:: {
    if IsTyping() {
        Send("{NumpadDot}")
        return
    }

    ; Spine 官方真正“Fit Selected to View” = Ctrl + Shift + F
    Send("^+f")

    ; 可选：额外微调一下缩放，让感觉更接近 Blender（很多人喜欢再近一点）
    ; Sleep(80)
    ; Send("{WheelUp}")  ; 如果你觉得太远了，取消注释这行
}

f:: {
    if IsTyping() {
        Send("f")
        return
    }

    ; Spine 原生 Ctrl+F = Zoom to 100%
    Send("^{f}")
}

; ==================================================Animation Tab 专属热键（可选）===================
; 这里的热键只在 Animation Tab 有效，可以根据需要启用
; ========== 空格 = 播放 / 暂停（Animate 模式神键）==========
Space:: {
    if IsTyping() {
        Send("{Space}")
        return
    }

    ; Spine 原生 D = Play / Pause
    Send("d")
}

; ========== Ctrl + 空格 = 倒放（超级丝滑）==========
; ^Space:: {
;     if IsTyping() {
;         Send("^{Space}")
;         return
;     }

;     ; Spine 原生 A = Play Reverse
;     Send("a")
; }

#HotIf  ; 结束 Spine 区块

; #HotIf WinActive("ahk_exe Blender.exe")
; ; Blender 专属热键
; #HotIf

; ==================== 全局兜底（几乎不用）===================
; 几乎所有热键我们都用上面的 MouseInTargetWindow() 方式，不需要全局

; ==================== 开机自启提示（可选）===================
TrayTip("通用艺术软件热键脚本已启动", "支持软件数: " TargetApps.Length, 1)