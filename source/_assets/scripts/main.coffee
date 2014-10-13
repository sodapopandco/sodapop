$(".screenshot img").each ->
  if ($(window).width() > 640) && (window.devicePixelRatio >= 2)
    $(this).attr("src", $(this).attr("src").replace(/([^.]*)\.(.*)/, "$1_2x.$2"))
