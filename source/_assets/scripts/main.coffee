$ ->
  shuffle()

shuffle = ->
  words = [
    "bright"
    "deft"
    "graceful"
    "light"
    "limber"
    "lithe"
    "lively"
    "nimble"
    "skilful"
    "sprightly"
    "spry"
    "supple"
  ]
  word = words[Math.round(Math.random() * words.length)]

  $(".header-tagline em").html word
  setTimeout shuffle, 2000

$(".header-link").hover ->
  $(".nimble").attr("src", "/assets/images/nimble.gif")
, ->
  $(".nimble").attr("src", "/assets/images/nimble-animated.gif")
