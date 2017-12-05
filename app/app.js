// ucs-2 string to base64 encoded ascii
function utoa(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}
// base64 encoded ascii to ucs-2 string
function atou(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

function selectText(id) {
  var range = document.createRange();
  range.selectNodeContents(document.getElementById(id));
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function copyToClipboard(id) {
  var elem = document.getElementById(id)
  selectText(id);
  var succeed;
  try {
    succeed = document.execCommand("copy");
  } catch (e) {
    succeed = false;
  }
  window.getSelection().removeAllRanges();
  return succeed;
}

$(document).ready(function () {
  var stylesList = [
    'github',
    'atom-one-light',
    'vs',
    'default',
    'mono-blue',
    'tomorrow',
    'color-brewer',
    'solarized-light',
  ];

  var format = function () {
    $('#pre').text(getInputVal());
    $('#pre').each(function (i, block) {
      hljs.highlightBlock(block);
    });
  };

  window.updateCSSOut = function () {
    var formatChoosen = $('input[name=format]:checked').val();
    $('#pre').removeClass();
    $('#pre').addClass(formatChoosen);
    return formatChoosen;
  };

  function getInputVal() {
    return $('#pre').text();
  }

  function selectStyle(style) {
    $('link[title]').each(function (i, link) {
      console.log(link, link.disabled, link.title !== style);
      link.disabled = (link.title !== style);
    });
  }

  function onFormatClick() {
    var formatChoosen = updateCSSOut();
    if (formatChoosen === 'xml') {
      $('#pre').text(vkbeautify.xml(getInputVal()));
    } else if (formatChoosen === 'json') {
      $('#pre').text(vkbeautify.json(getInputVal()));
    } else if (formatChoosen === 'javascript') {
      $('#pre').text(js_beautify(getInputVal(), { indent_size: 2 }));
    } else if (formatChoosen === 'bean') {
      $('#pre').text(benjbeautify.bean(getInputVal()));
    }
    format();
  }

  //INIT
  hljs.configure({
    tabReplace: ' '
  });

  stylesList.forEach((style, i) => {
    $('head').append(`<link rel="alternate stylesheet" title="${style}" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/${style}.min.css" disabled />`);
    $('#styles').append(`<option value="${style}">${style}</option>`);
  })

  if (location.hash && location.hash.substr(1).length > 0) {
    var data = JSON.parse(lzw_decode(atou(location.hash.substr(1))));
    $('title').html(data.title);
    $('#title').val(data.title);
    $('input[name="format"][value="' + data.type + '"]').prop('checked', true);
    $('label').removeClass('active');
    $('input[name="format"][value="' + data.type + '"]').parent().addClass('active');
    selectStyle(data.style);
    $('#styles option[value="' + data.style + '"]').prop('selected', true);
    if (data.data) {
      $('#pre').text(data.data);
      onFormatClick();
    }
  } else {
    selectStyle(stylesList[0]);
  }
  $('#pre').focus();
  $('#styles').change(() => {
    selectStyle($('#styles').val());
  })
  //END INIT

  $('textarea').keyup(function () {
    format();
  });

  $('#clear').click(function () {
    $('#pre').html('');
  });

  $('#clearCdata').click(function () {
    $('#pre').text(getInputVal().replace(/(<\!\[CDATA\[)|(\]\]>)/g, ''));
  });

  $('#format').click(onFormatClick);



  $('#copyShareURL').click(function () {
    var data = {
      title: $('title').html(),
      type: $('input[name=format]:checked').val(),
      style: $('#styles').val(),
      data: getInputVal()
    };
    $('#temp').text(location.origin + location.pathname + '#' + utoa(lzw_encode(JSON.stringify(data))));
    copyToClipboard('temp');
  });
});
