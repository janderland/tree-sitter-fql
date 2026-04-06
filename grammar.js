/// <reference types="tree-sitter-cli/dsl" />

module.exports = grammar({
  name: 'fql',

  extras: $ => [/\s/, $.comment],

  rules: {
    source_file: $ => repeat($.query),

    comment: _ => token(seq('%', /.*/)),

    query: $ => seq(
      $.directory,
      optional(seq(
        $.tuple,
        optional(seq('=', $.value)),
      )),
    ),

    value: $ => choice(
      'clear',
      'remove',
      $.data,
    ),

    directory: $ => prec.right(seq(
      '/',
      choice($.variable, $.string, $.dir_name),
      optional($.directory),
    )),

    dir_name: _ => token(/[a-zA-Z0-9._-]+/),

    tuple: $ => seq(
      '(',
      optional($._elements),
      ')',
    ),

    _elements: $ => prec.right(seq(
      $._element,
      repeat(prec.right(seq(',', $._element))),
      optional(','),
    )),

    _element: $ => choice($.data, $.maybemore),

    maybemore: _ => '...',

    data: $ => choice(
      $.nil,
      $.variable,
      $.tuple,
      $.bool,
      $.special_float,
      $.float,
      $.int,
      $.string,
      $.uuid,
      $.bytes,
      $.vstamp,
      $.reference,
      $.options,
    ),

    nil: _ => 'nil',

    bool: _ => choice('true', 'false'),

    special_float: _ => choice('-inf', 'inf', '-nan', 'nan'),

    int: _ => token(prec(-1, seq(
      optional('-'),
      /\d+/,
    ))),

    float: _ => token(seq(
      optional('-'),
      /\d+/,
      '.',
      /\d+/,
      optional(seq('e', optional('-'), /\d+/)),
    )),

    string: $ => seq(
      '"',
      repeat(choice($.escape_sequence, $.string_content)),
      '"',
    ),

    string_content: _ => token.immediate(prec(-1, /[^"\\]+/)),

    escape_sequence: _ => token.immediate(seq('\\', /./)),

    uuid: _ => token(seq(
      /[0-9A-Fa-f]{8}/,
      '-',
      /[0-9A-Fa-f]{4}/,
      '-',
      /[0-9A-Fa-f]{4}/,
      '-',
      /[0-9A-Fa-f]{4}/,
      '-',
      /[0-9A-Fa-f]{12}/,
    )),

    bytes: _ => token(seq('0x', /[0-9A-Fa-f]+/)),

    vstamp: _ => token(seq(
      '#',
      optional(/[0-9A-Fa-f]+/),
      ':',
      /[0-9A-Fa-f]{4}/,
    )),

    variable: $ => seq(
      '<',
      optional(choice(
        seq($.var_name, ':', optional($.var_types)),
        $.var_types,
      )),
      optional($.options),
      '>',
    ),

    var_name: _ => /[a-zA-Z0-9_.]+/,

    var_types: $ => seq(
      $.type_name,
      repeat(seq('|', $.type_name)),
    ),

    type_name: _ => choice(
      'any', 'tuple', 'tup', 'bool', 'int', 'num', 'bint',
      'float', 'string', 'str', 'uuid', 'bytes', 'vstamp',
      'nil', 'append', 'sum', 'avg', 'min', 'max', 'count',
    ),

    reference: $ => seq(
      ':',
      alias(/[a-zA-Z0-9_.]+/, $.ref_name),
    ),

    options: $ => seq(
      '[',
      optional(seq(
        $.option,
        repeat(seq(',', $.option)),
      )),
      ']',
    ),

    option: $ => choice(
      seq($.option_keyword, ':', $.option_value),
      $.option_keyword,
    ),

    option_keyword: _ => choice(
      'be', 'sep', 'endian', 'width', 'unsigned', 'raw',
      'bigendian', 'reverse', 'limit', 'mode', 'snapshot',
      'strict', 'pick',
      'i8', 'i16', 'i32', 'i64',
      'u8', 'u16', 'u32', 'u64',
      'f32', 'f64', 'f80',
    ),

    option_value: $ => choice(
      $.string,
      token(/[^,\]"]+/),
    ),
  },
});
