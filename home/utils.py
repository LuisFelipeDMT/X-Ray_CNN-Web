from io import BytesIO
import base64
import matplotlib.pyplot as plt

def get_plot(x,y):
    plt.switch_backend('AGG')
    plt.figure(figsize=(10,5))
    plt.title('Probabilidade por categoria de imagem')
    plt.bar(x,y)
    plt.xticks(rotation=45)
    plt.xlabel('Condição')
    plt.ylabel('Probabilidade')
    plt.tight_layout()
    buffer=BytesIO()
    plt.savefig(buffer,format='png')
    buffer.seek(0)
    image_png=buffer.getvalue()
    graph=base64.b64encode(image_png).decode('utf-8')
    buffer.close()
    return graph
