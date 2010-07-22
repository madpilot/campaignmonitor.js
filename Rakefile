desc 'Build the seperate scripts into one minified file'
task :build do
  jsmin = File.join(File.dirname(__FILE__), 'jsmin', 'jsmin.rb');
  output = File.join(File.dirname(__FILE__), 'build', 'campaignmonitor');

  Kernel.system("/bin/env echo '' > #{output}.js")
  [ 'suds.js', 'campaignmonitor.js', 'campaignmonitor.subscriber.js' ].each do |js|
    Kernel.system("/bin/env cat #{File.join(File.dirname(__FILE__), 'lib', js)} >> #{output}.js")
  end

  Kernel.system("/bin/env ruby #{jsmin} < #{output}.js > #{output}.min.js")
end
