# Get the directory that this configuration file exists in
dir = File.dirname(__FILE__)

# Load the sencha-touch and touch-charts frameworks automatically.
load File.join(dir, '..', '..', 'SDK', 'touch', 'resources', 'themes')
load File.join(dir, '..', '..', 'SDK', 'charts', 'resources', 'themes')

# Compass configurations
sass_path = dir
css_path = File.join(dir, "..", "css")

images_path = File.join(dir, '..', '..', 'SDK', 'charts', 'resources', 'images')

# Require any additional compass plugins here.
environment  = :production
output_style = :compressed
