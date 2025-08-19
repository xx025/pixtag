import os
import signal

import uvicorn
import webview

from app import app, host, port


def on_closed():
    os.kill(os.getpid(), signal.SIGTERM)
    print("Window closed, exiting application.")


def start_server():
    uvicorn.run(app, host=host, port=port)


if __name__ == "__main__":
    window = webview.create_window(
        title='PixTag|归影',
        url=f"http://localhost:{port}/",
        text_select=False,
    )
    window.events.closed += on_closed  # 窗口关闭时退出程序
    webview.start(start_server)
