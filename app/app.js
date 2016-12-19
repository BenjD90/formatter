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
  var format = function() {
    $('#pre').text(getInputVal());
    $('#pre').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  };

  window.updateCSSOut = function() {
    var formatChoosen = $('input[name=format]:checked').val();
    $('#pre').removeClass();
    $('#pre').addClass(formatChoosen);
    return formatChoosen;
  };

  function getInputVal() {
    return $('#pre').text();
  }

  function onFormatClick() {
    var formatChoosen = updateCSSOut();
    if(formatChoosen === 'xml') {
      $('#pre').text(vkbeautify.xml(getInputVal()));
    } else if(formatChoosen === 'json') {
      $('#pre').text(vkbeautify.json(getInputVal()));
    } else if(formatChoosen === 'bean') {
      $('#pre').text(benjbeautify.bean(getInputVal()));
    }
    format();
  }

  //INIT
  hljs.configure({
    tabReplace: ' '
  });
  if(location.hash && location.hash.substr(1).length > 0) {
    var data = JSON.parse(decodeURIComponent(location.hash.substr(1)));
    $('input[name="format"][value="'+data.type+'"]').prop('checked', true);
    $('label').removeClass('active');
    $('input[name="format"][value="'+data.type+'"]').parent().addClass('active');
    $('#pre').text(data.data);
    onFormatClick();
  }
  $('#pre').focus();
  //END INIT

  $('textarea').keyup(function() {
    format();
  });

  $('#clear').click(function() {
    $('#pre').html('');
  });

  $('#clearCdata').click(function() {
    $('#pre').text(getInputVal().replace(/(<\!\[CDATA\[)|(\]\]>)/g,''));
  });

  $('#format').click(onFormatClick);



  $('#copyShareURL').click(function() {
    var data = {
      type: $('input[name=format]:checked').val(),
      data: getInputVal()
    };
    $('#temp').text(location.origin + location.pathname+'#'+ encodeURIComponent(JSON.stringify(data)));
    copyToClipboard('temp');
  });
});
