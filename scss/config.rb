dir = File.dirname(__FILE__)

load File.join(dir, '..', 'lib', 'touch', 'resources', 'themes')
load File.join(dir, '..', 'lib', 'charts', 'resources', 'themes')

sass_path = dir
css_path = File.join(dir, "..", "css")
images_path = File.join(dir, '..', 'lib', 'charts', 'resources', 'images')

environment  = :production
output_style = :compressed
