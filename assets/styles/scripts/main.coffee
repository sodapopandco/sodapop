# Replace screenshot images based on window width and pixel density.
$(".screenshot img").each ->
  # If it's a double pixel density display show the 2x image.
  if (window.devicePixelRatio >= 2)
    $(this).attr('src', $(this).attr('src').replace(/([^.]*)\.(.*)/, "$1_2x.$2"))
