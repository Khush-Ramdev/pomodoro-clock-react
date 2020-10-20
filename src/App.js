import React from 'react'
import './App.scss'

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 1500,
            workTime: 1500,
            breakTime: 300,
            running: false,
            break: false,
            sessionIncrementDisabled: false,
            sessionDecrementDisabled: false,
            breakIncrementDisabled: false,
            breakDecrementDisabled: false,
        }
        this.onTimerChange = this.onTimerChange.bind(this);
        this.timerStart = this.timerStart.bind(this);
        this.timeDecrease = this.timeDecrease.bind(this);
        this.onRunningChange = this.onRunningChange.bind(this);
        this.convert = this.convert.bind(this);
        this.reset = this.reset.bind(this);
        this.alarm = this.alarm.bind(this);
    }
    alarm = () => {
        this.promiseAudio = this.audioBeep.play();
        this.promiseAudio = this.audioBeep.currentTime = 0;
    }
    reset = () => {
        this.setState(() => ({
            time: 1500,
            workTime: 1500,
            breakTime: 300,
            running: false,
            break: false,
            sessionIncrementDisabled: false,
            sessionDecrementDisabled: false,
            breakIncrementDisabled: false,
            breakDecrementDisabled: false,
        }))
        if (this.promiseAudio !== undefined) {
            this.audioBeep.pause();
            this.audioBeep.currentTime = 0;
        }
        clearTimeout(this.timerID)
    }
    convert = () => {
        let minutes = Math.floor(this.state.time / 60);
        let seconds = this.state.time - minutes * 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return minutes + ':' + seconds;
    }
    onTimerChange = (time, string) => {
        if (string === "session") {
            if ((this.state.workTime / 60) > 0 && (this.state.workTime / 60) <= 60) {
                
                if ((this.state.workTime / 60) == 1) {
                    
                    time = time * 60;
                    this.setState(() => ({
                        sessionDecrementDisabled: true
                    }))
                    if (time > 0) {
                        this.setState((prevState) => ({
                            time: prevState.time + time,
                            workTime: prevState.workTime + time,
                            sessionDecrementDisabled: false
                        }))
                    }
                }
                else if ((this.state.workTime / 60) == 60) {
                    
                    time = time * 60;
                    this.setState(() => ({
                        sessionIncrementDisabled: true
                    }))
                    if (time < 0) {
                        this.setState((prevState) => ({
                            time: prevState.time + time,
                            workTime: prevState.workTime + time,
                            sessionIncrementDisabled: false
                        }))
                    }
                }
                else {
                    time = time * 60;
                    this.setState((prevState) => ({
                        time: prevState.time + time,
                        workTime: prevState.workTime + time,
                    }))
                }

            }
        }
        else if (string === "break") {
            if ((this.state.breakTime / 60) > 0 && (this.state.breakTime / 60) <= 60) {
                
                if ((this.state.breakTime / 60) == 1) {
                    
                    time = time * 60;
                    this.setState(() => ({
                        breakDecrementDisabled: true
                    }))
                    if (time > 0) {
                        this.setState((prevState) => ({
                            // time: prevState.time + time,
                            breakTime: prevState.breakTime + time,
                            breakDecrementDisabled: false
                        }))
                    }
                }
                else if ((this.state.breakTime / 60) == 60) {
                    
                    time = time * 60;
                    this.setState(() => ({
                        breakIncrementDisabled: true
                    }))
                    if (time < 0) {
                        this.setState((prevState) => ({
                            // time: prevState.time + time,
                            breakTime: prevState.breakTime + time,
                            breakIncrementDisabled: false
                        }))
                    }
                }
                else {
                    time = time * 60;
                    this.setState((prevState) => ({
                        // time: prevState.time + time,
                        breakTime: prevState.breakTime + time,
                    }))
                }

            }
        }
    }
    onRunningChange = (running) => {
        this.setState(() => ({
            running: !running
        }))
    }
    timeDecrease = () => {
        if (this.state.time > 0) {
            this.setState((prevState) => ({
                time: prevState.time - 1
            }))
        }
        else {
            this.alarm();
            if (!this.state.break) {
                this.setState((prevState) => ({
                    time: prevState.breakTime,
                    break: true
                }))
            }
            else {
                this.reset();
            }
        }
    }
    timerStart = () => {
        this.onRunningChange(this.state.running);
        this.setState(() => ({
            sessionIncrementDisabled: true,
            sessionDecrementDisabled: true,
            breakIncrementDisabled: true,
            breakDecrementDisabled: true
        }))
        if (!this.state.running) {
            this.timerID = setInterval(this.timeDecrease, 1000)
        }
        else {
            clearTimeout(this.timerID)
        }
    }
    render() {
        return (
            <div className="container display col">
                <Header />
                <div className="timer-container display even">
                    <Session
                        workTime={this.state.workTime}
                        onTimerChange={this.onTimerChange}
                        sessionIncrementDisabled={this.state.sessionIncrementDisabled}
                        sessionDecrementDisabled={this.state.sessionDecrementDisabled}
                    />
                    <Break
                        breakTime={this.state.breakTime}
                        onTimerChange={this.onTimerChange}
                        breakDecrementDisabled={this.state.breakDecrementDisabled}
                        breakIncrementDisabled={this.state.breakIncrementDisabled}
                    />
                </div>
                <Clock
                    break={this.state.break}
                    running={this.state.running}
                    convert={this.convert}
                    timerStart={this.timerStart}
                    reset={this.reset}
                />
                <audio
                    id="beep"
                    preload="auto"
                    src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
                    ref={(audio) => {
                        this.audioBeep = audio;
                    }}
                />
                <div id="made-by">
                   <a href="https://github.com/Khush-Ramdev/pomodoro-clock-react" target="_blank">
                   Made By : Khush Ramdev
                     </a> 
                </div>
            </div>

        )
    }
}

const Header = (props) => {
    return (
        <div>
            <h2 id="heading">Pomodoro Clock</h2>
        </div>
    )
}
const Session = props => {
    return (
        <div>
            <div id="session-label">Session length</div>
            <div className="display even">
                <button
                    disabled={props.sessionDecrementDisabled}
                    className="btn"
                    id="session-decrement"
                    onClick={() => { props.onTimerChange(-1, "session") }}>
                    <i className="fas fa-arrow-down"></i>
                </button>
                <div id="session-length">{Math.floor(props.workTime / 60)}</div>
                <button
                    disabled={props.sessionIncrementDisabled}
                    className="btn"
                    id="session-increment"
                    onClick={() => { props.onTimerChange(1, "session") }}>
                    <i className="fas fa-arrow-up"></i>
                </button>
            </div>
        </div>
    )
}


const Break = (props) => {
    return (
        <div>
            <div id="break-label">Break length</div>
            <div className="display even">
                <button
                    disabled={props.breakDecrementDisabled}
                    className="btn"
                    id="break-decrement"
                    onClick={() => { props.onTimerChange(-1, "break") }}>
                    <i className="fas fa-arrow-down"></i>
                </button>
                <div id="break-length">{Math.floor(props.breakTime / 60)}</div>
                <button
                    disabled={props.breakIncrementDisabled}
                    className="btn"
                    id="break-increment"
                    onClick={() => { props.onTimerChange(1, "break") }}>
                    <i className="fas fa-arrow-up"></i>
                </button>
            </div>
        </div>
    )
}

const Clock = (props) => {
    return (
        <div className="display col even">
            {props.break ? <p id="timer-label">break</p> : <p id="timer-label">session</p>}
            <div id="time-left" >{props.convert()}</div>
            <div className="display even">
                <button className="btn" id="start_stop" onClick={props.timerStart}>{props.running ? "Stop" : "Start"}</button>
                <button className="btn" id="reset" onClick={() => { props.reset() }}>reset</button>
            </div>
        </div>
    )
}

export default Timer;