; Comments
(comment) @comment

; Keywords
(nil) @constant.builtin
(bool) @constant.builtin
(special_float) @constant.builtin
"clear" @keyword
"remove" @keyword

; Numbers
(int) @number
(float) @number.float
(uuid) @number
(bytes) @number
(vstamp) @number

; Strings
(string) @string
(string_content) @string
(escape_sequence) @string.escape

; Variables
(type_name) @type
(var_name) @variable
"<" @punctuation.bracket
">" @punctuation.bracket

; Directory
(dir_name) @module
["/" "@"] @punctuation.delimiter

; Tuple
"(" @punctuation.bracket
")" @punctuation.bracket
"," @punctuation.delimiter

; Operators
"=" @operator
(maybemore) @punctuation.special

; References
(ref_name) @variable.parameter

; Options
(option_keyword) @keyword
"[" @punctuation.bracket
"]" @punctuation.bracket
