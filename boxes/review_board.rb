#!/usr/bin/env ruby
require 'net/http'
require 'rubygems'
require 'json'
require 'date'
require 'set'

config={}
File.open('review_board.properties').each do |line|
  x = line.split('=')
  config[x[0]]=x[1]
end

url=URI.parse(config['url'])
http = Net::HTTP.new url.host, port=url.port
resp = http.get("#{url.path}?#{url.query.to_s}", {'Accept' => 'text/json'})
puts resp.body
data = JSON.parse(resp.body)

overdue=[]
volume_overdue=0
volume_pending=0
blame=SortedSet.new()

a=Date.today
data['review_requests'].each do |r|
  b=Date.parse(r['time_added'])
  if a-b > 7 then
    overdue << r
    volume_overdue=(volume_overdue + (a-b))
    blame.add(r['target_people'].map { |p| p['title'] })
  end
  volume_pending=volume_pending+(a-b)
end

puts "{"
puts "\"header\": \"Reviews\","
puts "\"body\": \"<span class='xx-large'>#{volume_overdue}</span>/#{volume_pending} review units\","
puts "\"footer\": \"#{blame.to_a.join(', ')}\","
if volume_overdue > 50 then
  puts "\"status\": \"red\""
elsif volume_overdue > 25 then
    puts "\"status\": \"amber\""
else
  puts "\"status\": \"green\""
end
puts "}"
