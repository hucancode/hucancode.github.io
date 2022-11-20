"use client";
import React from "react";

export default class Canvas3D extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isInCamera: false };
    this.canvasRef = React.createRef();
    this.loadingRef = React.createRef();
    this.frameID = 0;
  }
  componentDidMount() {
    this.init();
    this.observer = new IntersectionObserver(([entry]) => {
      this.setState({ isInCamera: entry.isIntersecting });
    });
    if (this.canvasRef.current) {
      this.observer.observe(this.canvasRef.current);
    }
    if (this.loadingRef.current) {
      this.loadingRef.current.classList.add("invisible");
    }
  }
  componentWillUnmount() {
    this.observer.disconnect();
    cancelAnimationFrame(this.frameID);
  }
  componentDidUpdate() {
    cancelAnimationFrame(this.frameID);
    if (this.state.isInCamera) {
      const scope = this;
      const renderLoop = function () {
        scope.frameID = requestAnimationFrame(renderLoop);
        scope.animate();
      };
      renderLoop();
    }
  }
  render() {
    return (
      <div className="relative h-full w-full">
        <div
          ref={this.loadingRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <svg
            className="h-10 w-10 animate-spin text-black dark:text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <canvas
          className="absolute w-full h-full"
          id={this.canvasID}
          ref={this.canvasRef}
        ></canvas>
      </div>
    );
  }
}
