#=== example wss (secure) wesocket iped client, ap ruymgaart, www.texansmarthome.com
#!/usr/bin/python

import time
import websocket,socket,ssl
from websocket import create_connection

bSecure = True
ws = None

if bSecure:

	publicKeyCertLocation = 'scert.crt'
	opts = {'ca_certs': publicKeyCertLocation, 'cert_reqs': ssl.CERT_REQUIRED, }
	ws = create_connection("wss://127.0.0.1:3000/", sslopt=opts)
else:

	ws = create_connection("ws://localhost:3000/")

for i in range(100):

	print "send 2 iped messages"
	ws.send("*1:2:3:4:5:6:7:8*8:7:6:5:4:3:2:2*")
	result =  ws.recv()
	print "Received '%s'" % result

	time.sleep(5)

ws.close()


