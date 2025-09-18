import json
import tkinter as tk

# JSON Data (traffic light)
traffic_light_json = """
{
  "shapes": [
    {
      "type": "rectangle",
      "x": 50,
      "y": 50,
      "width": 100,
      "height": 300,
      "color": "gray"
    },
    {
      "type": "circle",
      "x": 100,
      "y": 100,
      "radius": 40,
      "color": "red"
    },
    {
      "type": "circle",
      "x": 100,
      "y": 200,
      "radius": 40,
      "color": "yellow"
    },
    {
      "type": "circle",
      "x": 100,
      "y": 300,
      "radius": 40,
      "color": "green"
    }
  ]
}
"""

# Load JSON
data = json.loads(traffic_light_json)

# Create window
root = tk.Tk()
root.title("Traffic Light")

# Create canvas
canvas = tk.Canvas(root, width=300, height=400, bg="black")
canvas.pack()

# Draw shapes from JSON
for shape in data["shapes"]:
    if shape["type"] == "circle":
        x, y, r = shape["x"], shape["y"], shape["radius"]
        color = shape["color"]
        canvas.create_oval(x-r, y-r, x+r, y+r, fill=color, outline="white")

    elif shape["type"] == "rectangle":
        x, y = shape["x"], shape["y"]
        w, h = shape["width"], shape["height"]
        color = shape["color"]
        canvas.create_rectangle(x, y, x+w, y+h, fill=color, outline="white")

root.mainloop()
