# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard :jasmine, server: :jasmine_gem, server_timeout:  120, port:  8888, timeout: 60, :server_mount => '/specs' do
  watch(%r{spec/javascripts/spec\.(js\.coffee|js|coffee)$}) { 'spec/javascripts' }
  watch(%r{spec/javascripts/.+_spec\.(js\.coffee|js|coffee)$})
  watch(%r{spec/javascripts/fixtures/.+$})
  watch(%r{app/assets/javascripts/(.+?)\.(js\.coffee|js|coffee)(?:\.\w+)*$}) { |m| "spec/javascripts/#{ m[1] }_spec.#{ m[2] }" }
end

guard 'coffeescript', :input => 'app/assets/javascripts'
