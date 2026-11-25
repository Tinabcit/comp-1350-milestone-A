
# -*- mode: ruby -*-
# COMP 1350 - Milestone C
# Note-Taking App Load Balancing


Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/jammy64"

  config.vm.define "backend1" do |b1|
    b1.vm.hostname = "backend1"
    b1.vm.network "private_network", ip: "192.168.56.21"
  end

  config.vm.define "backend2" do |b2|
    b2.vm.hostname = "backend2"
    b2.vm.network "private_network", ip: "192.168.56.22"
  end

  config.vm.define "lb" do |lb|
    lb.vm.hostname = "lb"
    lb.vm.network "private_network", ip: "192.168.56.20"
  end
  # Secondary Load Balancer
  config.vm.define "lb2" do |lb2|
    lb2.vm.box = "ubuntu/jammy64"
    lb2.vm.hostname = "lb2"
    lb2.vm.network "private_network", ip: "192.168.56.23"
  end

end
