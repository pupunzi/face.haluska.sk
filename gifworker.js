importScripts('gif/LZWEncoder.js', 'gif/NeuQuant.js', 'gif/GIFEncoder.js', 'gif/b64.js');

var gif_encoder = 0;

self.addEventListener('message', function(e)
{
	var p;

	switch (e.data.cmd)
	{
		case 'start':
						p = e.data;
						gif_start(p.loop, p.time, p.wid, p.hei, p.trans, p.trans_color);
						postMessage({cmd:"start"}/*{shader:val_shader,out:out}*/);
						break;
		case 'params':
						p = e.data;
						if (gif_encoder)
						{
							gif_encoder.setDelay(p.time);
							postMessage({cmd:"params"});
						}
						break;
		case 'frame':
						p = e.data;
						gif_encoder.addFrame(p.frame, true);
						postMessage({cmd:"frame"}/*{shader:val_shader,out:out}*/);
						break;
		case 'save':
						p = e.data;
						gif_encoder.finish();
						postMessage({cmd:"gif", gif:encode64(gif_encoder.stream().getData())})
						break;
	}
}, false);

function gif_start(loop, time, wid, hei, trans, trans_color)
{
	gif_encoder = new GIFEncoder();

	if (loop) gif_encoder.setRepeat(0);
	gif_encoder.setDelay(time);
	// gif_encoder.setTransparent(trans ? trans_color : null)
	gif_encoder.setSize(wid, hei);
	gif_encoder.start();
}