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
  } catch(e) {
    succeed = false;
  }
  window.getSelection().removeAllRanges();
  return succeed;
}

$(document).ready(function() {
  window.updateCSSOut = function() {
    var formatChoosen = $('input[name=format]:checked').val();
    $('#pre').removeClass();
    $('#pre').addClass(formatChoosen);
    return formatChoosen;
  };

  function getInputVal() {
    return $('#pre').text();
  }

  hljs.configure({
    tabReplace: ' '
  });
  $('#pre').focus();

  var format = function() {
    $('#pre').text(getInputVal());
    $('#pre').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  };

  $('textarea').keyup(function() {
    format();
  });

  $('#clear').click(function() {
    $('#pre').html('');
  });

  $('#clearCdata').click(function() {
    $('#pre').text(getInputVal().replace(/(<\!\[CDATA\[)|(\]\]>)/g,''));
  });

  $('#format').click(function() {
    var formatChoosen = updateCSSOut();
    if(formatChoosen === 'xml') {
      $('#pre').text(vkbeautify.xml(getInputVal()));
    } else if(formatChoosen === 'json') {
      $('#pre').text(vkbeautify.json(getInputVal()));
    } else if(formatChoosen === 'bean') {
      $('#pre').text(benjbeautify.bean(getInputVal()));
    }
    format();
  });
});
