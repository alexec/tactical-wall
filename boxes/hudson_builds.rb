#!/usr/bin/env ruby
require 'net/http'
require 'rexml/document'

config={}
File.open('hudson_builds.properties').each do |line|
  x = line.split('=')
  config[x[0]]=x[1]
end
xml_data = Net::HTTP.get_response(URI.parse(config['url'])).body

# extract event information
doc = REXML::Document.new(xml_data)
stable=[]
unknown=[]
broken=[]
doc.elements.each('/feed/entry/title') do |ele|
  title=ele.text
  # puts title

  m=/(.*) (#[0-9]+) \(([^ ]*).*\)/.match(title)
  name=m[1]
  buildNo=m[2]
  status=title =~/back to normal/ ? 'stable' : title =~ /started to fail/ ? 'broken' : m[3] == '?' ? 'unknown' : m[3]

  # puts "#{title}, #{name}, #{status}"

  unless title =~ Regexp.new(config['ignore']) then
    case status
      when 'stable'
        stable << name
      when 'unknown'
        unknown << name
      when 'broken'
        broken << name
      else
        puts "invalid status #{status} (#{title})"
        exit 1
    end
  end
end

puts "{"
puts "\"header\": \"Builds\","
if broken.length > 0 then
  puts "\"body\": \"<span class='#{broken.length==1?'xx-large':broken.length==2?'x-large':'large'}'>#{broken.join(', ')}</span>\","
  puts "\"footer\": \"\","
  puts "\"status\": \"red\""
elsif stable.length > 0
  puts "\"body\": \"<span class='xx-large'>OK</span>\","
  puts "\"footer\": \"#{stable.length} stable\","
  puts "\"status\": \"green\""
else
  puts "\"body\": \"Error\","
  puts "\"footer\": \"Problem getting data\","
  puts "\"status\": \"none\""
end
puts "}"

