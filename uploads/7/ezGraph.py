import matplotlib.pyplot as plt
import numpy as np

class ezGraph:
    def __init__(self, xmin=0, xmax=10, ymin="auto", ymax="auto", xLabel="x", yLabel="y"):
        self.x = []          
        self.y = []
        self.fig, self.ax = plt.subplots()    # initialize matplotlib plot
        plt.xlim([xmin, xmax])
        if ymin != "auto" and ymax != "auto":
            plt.ylim([ymin, ymax])
        self.xLabel, self.yLabel = xLabel, yLabel
        self.setLabels()
        self.ax.plot(self.x, self.y)               # put data into plot (line)
        self.ax.scatter(self.x, self.y)  

    def setLabels(self):
        self.ax.set_xlabel(self.xLabel)  # label axes
        self.ax.set_ylabel(self.yLabel)  # label axes

    def add(self, x, y):
        self.x.append(x)
        self.y.append(y) 
        self.clear()
        self.setLabels()
        self.ax.plot(self.x, self.y)               # put data into plot
        self.ax.scatter(self.x, self.y)

    def plot(self, y, dx=1):
        self.x = np.ones(y.shape) 
        for i in range(len(self.x)):
            self.x[i] = i * dx
        self.y = y 
        self.ax.plot(self.x, self.y)               # put data into plot
        self.ax.scatter(self.x, self.y)

    def updatePlot(self, y, dt=0.25, title="Plot", dx=1):
        self.clear()
        self.plot(y, dx)
        self.title(title)
        self.wait(dt)

    def wait(self, dt):
        plt.pause(dt)

    def keepOpen(self):
        plt.show()

    def clear(self):
        plt.cla()

    def title(self, txt="Plot"):
        self.ax.set_title(txt)
        



class ezGraphMM:
    def __init__(self, xmin="auto", xmax="auto", ymin="auto", ymax="auto", xLabel="x", yLabel="y", x_measured=[], y_measured=[]):
        self.measured = {
            "x": [],
            "y": []
        }
        self.modeled = {
            "x": [],
            "y": []
        }

        self.fig, self.ax = plt.subplots()    # initialize matplotlib plot
        if xmin != "auto" and xmax != "auto":
            plt.xlim([xmin, xmax])
        if ymin != "auto" and ymax != "auto":
            plt.ylim([ymin, ymax])
        self.xLabel, self.yLabel = xLabel, yLabel
        self.setLabels()
        self.ax.plot(self.modeled["x"], self.modeled["y"])               # put data into plot (line)
        self.ax.scatter(self.modeled["x"], self.modeled["y"]) 

        self.addMeasured(x_measured, y_measured)
        #self.ax.scatter(x_measured, y_measured)
        
    def setLabels(self):
        self.ax.set_xlabel(self.xLabel)  # label axes
        self.ax.set_ylabel(self.yLabel)  # label axes

    def addMeasured(self, xarr, yarr):
        self.measured["x"] = xarr
        self.measured["y"] = yarr
        self.plotMeasured()

    def plotMeasured(self):
        self.clear()
        self.setLabels()
        self.ax.scatter(self.measured["x"], self.measured["y"])

    def addModeled(self, x, y):
        self.modeled["x"].append(x)
        self.modeled["y"].append(y) 
        self.plotModeled()

    def plotModeled(self):
        self.clear()
        self.setLabels()
        self.plotMeasured()
        self.ax.plot(self.modeled["x"], self.modeled["y"])               # put data into plot
        self.ax.scatter(self.modeled["x"], self.modeled["y"])

    def wait(self, dt):
        plt.pause(dt)

    def keepOpen(self):
        plt.show()

    def clear(self):
        plt.cla()

    def title(self, txt="Plot"):
        self.ax.set_title(txt)
        