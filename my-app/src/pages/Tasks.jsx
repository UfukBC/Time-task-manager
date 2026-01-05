import { useEffect, useState, useMemo } from "react";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState("");
  const [filterTags, setFilterTags] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [now, setNow] = useState(Date.now());

  const [showSummary, setShowSummary] = useState(false);
  const [observationStart, setObservationStart] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const offset = today.getTimezoneOffset() * 60000;
    const localISOTime = new Date(today - offset).toISOString().slice(0, 16);
    return localISOTime;
  });
  const [observationEnd, setObservationEnd] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - offset).toISOString().slice(0, 16);
    return localISOTime;
  });

  const [showTagSummary, setShowTagSummary] = useState(false);
  const [tagObservationStart, setTagObservationStart] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const offset = today.getTimezoneOffset() * 60000;
    const localISOTime = new Date(today - offset).toISOString().slice(0, 16);
    return localISOTime;
  });
  const [tagObservationEnd, setTagObservationEnd] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - offset).toISOString().slice(0, 16);
    return localISOTime;
  });

  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState(null);
  const [taskDetailsStart, setTaskDetailsStart] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const offset = today.getTimezoneOffset() * 60000;
    const localISOTime = new Date(today - offset).toISOString().slice(0, 16);
    return localISOTime;
  });
  const [taskDetailsEnd, setTaskDetailsEnd] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - offset).toISOString().slice(0, 16);
    return localISOTime;
  });

  const [showDailyChart, setShowDailyChart] = useState(false);
  const [selectedTaskForChart, setSelectedTaskForChart] = useState(null);
  const [chartStartDate, setChartStartDate] = useState(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const offset = sevenDaysAgo.getTimezoneOffset() * 60000;
    return new Date(sevenDaysAgo - offset).toISOString().slice(0, 10);
  });
  const [chartEndDate, setChartEndDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today - offset).toISOString().slice(0, 10);
  });

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenWidth < 768;
  const isSmall = screenWidth < 500;

  const colors = {
    pageBg: "#ffffff",
    pageText: "#222222",
    cardBgActive: "#e6ffe6",
    cardBgInactive: "#ffffff",
    cardBorderActive: "#2ecc71",
    cardBorderInactive: "#888888",
    tagBgActive: "#1859a3",
    tagBgInactive: "#4ad5da",
    tagTextOnDark: "#ffffff",
    btnStartBg: "#27ae60",
    btnStopBg: "#f39c12",
    deleteBg: "#d64545",
    chipBg: "#dceeff",
    chipBorder: "#aac7ff",
    inputBg: "#ffffff",
    inputBorder: "#ccc",
  };

  useEffect(() => {
    fetchTags();
    fetchTasks();
    fetchTimestamps();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const fetchTimestamps = () => {
    fetch("http://localhost:3010/timestamps")
      .then((res) => res.json())
      .then(setTimestamps)
      .catch(console.error);
  };

  const fetchTags = () => {
    fetch("http://localhost:3010/tags")
      .then((res) => res.json())
      .then(setTags)
      .catch(console.error);
  };

  const fetchTasks = () => {
    fetch("http://localhost:3010/tasks")
      .then((res) => res.json())
      .then((taskData) => {
        setTasks(taskData);
        fetchTimestamps();
      })
      .catch(console.error);
  };

  const addTimestamp = (taskId, type) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const localTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    const newTs = {
      timestamp: localTimestamp,
      task: taskId,
      type: type,
    };
    fetch("http://localhost:3010/timestamps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTs),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add timestamp");
        return res.json();
      })
      .then(() => fetchTimestamps())
      .catch(console.error);
  };

  const handleStartActivity = (taskId) => addTimestamp(taskId, 0);
  const handleStopActivity = (taskId) => addTimestamp(taskId, 1);

  const handleAddTask = (e) => {
    e.preventDefault();
    const newTask = {
      name: newTaskName,
      tags: selectedTagIds.join(","),
      additional_data: "",
    };
    fetch("http://localhost:3010/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add task");
        return res.json();
      })
      .then(() => {
        setNewTaskName("");
        setSelectedTagIds([]);
        setShowForm(false);
        fetchTasks();
      })
      .catch(console.error);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    const newTag = { name: newTagName, additional_data: "" };
    fetch("http://localhost:3010/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTag),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add tag");
        return res.json();
      })
      .then(() => {
        setNewTagName("");
        fetchTags();
      })
      .catch(console.error);
  };

  const handleDeleteTag = (tagId) => {
    if (!window.confirm("Delete this tag?")) return;
    fetch(`http://localhost:3010/tags/${tagId}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete tag");
        fetchTags();
        fetchTasks();
      })
      .catch(console.error);
  };

  const handleDeleteTask = (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    
    const taskTimestamps = timestamps.filter((ts) => ts.task === taskId);
    const deleteTimestampPromises = taskTimestamps.map((ts) =>
      fetch(`http://localhost:3010/timestamps/${ts.id}`, { method: "DELETE" })
        .catch(err => console.error(`Failed to delete timestamp ${ts.id}:`, err))
    );

    Promise.all(deleteTimestampPromises)
      .then(() => {
        return fetch(`http://localhost:3010/tasks/${taskId}`, { method: "DELETE" });
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete task");
        fetchTasks();
        fetchTimestamps();
      })
      .catch(console.error);
  };

  const handleResetTime = (taskId) => {
    if (!window.confirm("Reset all time records for this task?")) return;
    
    const taskTimestamps = timestamps.filter((ts) => ts.task === taskId);
    const deletePromises = taskTimestamps.map((ts) =>
      fetch(`http://localhost:3010/timestamps/${ts.id}`, { method: "DELETE" })
        .catch(err => console.error(`Failed to delete timestamp ${ts.id}:`, err))
    );

    Promise.all(deletePromises)
      .then(() => {
        fetchTimestamps();
      })
      .catch(console.error);
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditedTaskName(task.name);
  };

  const handleSaveEdit = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const updatedTask = { ...task, name: editedTaskName };
    try {
      const res = await fetch(`http://localhost:3010/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      if (!res.ok) throw new Error("Failed to update task");
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
      setEditingTaskId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTaskTagToggle = (task, tagId) => {
    const currentTags = task.tags ? task.tags.split(",").map(Number) : [];
    const updatedTags = currentTags.includes(tagId)
      ? currentTags.filter((id) => id !== tagId)
      : [...currentTags, tagId];
    const updatedTask = { ...task, tags: updatedTags.join(",") };
    fetch(`http://localhost:3010/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update tags");
        fetchTasks();
      })
      .catch(console.error);
  };

  const addFilterTag = (raw) => {
    const name = (raw || "").trim().toLowerCase();
    if (!name) return;
    const match = tags.find((t) => t.name.toLowerCase() === name);
    if (!match || filterTags.includes(name)) return;
    setFilterTags((prev) => [...prev, name]);
    setFilterInput("");
  };

  const removeFilterTag = (name) =>
    setFilterTags((prev) => prev.filter((p) => p !== name));

  const onFilterKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addFilterTag(filterInput);
    } else if (e.key === "Backspace" && !filterInput && filterTags.length > 0) {
      setFilterTags((prev) => prev.slice(0, -1));
    }
  };

  const parseTs = (str) => {
    if (!str) return NaN;
    const parts = str.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
    if (!parts) return NaN;
    const [, year, month, day, hour, min, sec] = parts;
    const d = new Date(year, month - 1, day, hour, min, sec);
    return d.getTime();
  };

  const formatTimestamp = (tsStr) => {
    if (!tsStr) return "";
    const parts = tsStr.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
    if (!parts) return tsStr;
    const [, year, month, day, hour, min, sec] = parts;
    return `${day}.${month}.${year} ${hour}:${min}:${sec}`;
  };

  const getTaskTimestamps = (taskId) =>
    timestamps
      .filter((ts) => ts.task === taskId)
      .slice()
      .sort((a, b) => parseTs(a.timestamp) - parseTs(b.timestamp));

  const isTaskActive = (taskId) => {
    const list = getTaskTimestamps(taskId);
    if (list.length === 0) return false;
    return list[list.length - 1].type === 0;
  };

  const calculateAccumulatedTime = (taskId) => {
    const list = getTaskTimestamps(taskId);
    let totalMs = 0;
    let startMs = null;

    for (const ts of list) {
      const tsMs = parseTs(ts.timestamp);
      if (Number.isNaN(tsMs)) continue;

      if (ts.type === 0) {
        startMs = tsMs;
      } else if (ts.type === 1 && startMs !== null) {
        totalMs += tsMs - startMs;
        startMs = null;
      }
    }

    if (startMs !== null) {
      totalMs += now - startMs;
    }

    const sec = Math.floor(totalMs / 1000);
    if (sec < 0) return "0s";

    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    let str = "";
    if (h > 0) str += `${h}h `;
    if (m > 0 || h > 0) str += `${m}m `;
    str += `${s}s`;
    return str.trim() || "0s";
  };

  const calculateActiveTimeInInterval = (taskId, startMs, endMs) => {
    const list = getTaskTimestamps(taskId);
    let totalMs = 0;
    let activeStartMs = null;

    for (const ts of list) {
      const tsMs = parseTs(ts.timestamp);
      if (Number.isNaN(tsMs)) continue;

      if (ts.type === 0) {
        activeStartMs = tsMs;
      } else if (ts.type === 1 && activeStartMs !== null) {
        const overlapStart = Math.max(activeStartMs, startMs);
        const overlapEnd = Math.min(tsMs, endMs);
        if (overlapStart < overlapEnd) {
          totalMs += overlapEnd - overlapStart;
        }
        activeStartMs = null;
      }
    }

    if (activeStartMs !== null) {
      const overlapStart = Math.max(activeStartMs, startMs);
      const overlapEnd = Math.min(now, endMs);
      if (overlapStart < overlapEnd) {
        totalMs += overlapEnd - overlapStart;
      }
    }

    const sec = Math.floor(totalMs / 1000);
    if (sec < 0) return { seconds: 0, formatted: "0s" };

    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    let str = "";
    if (h > 0) str += `${h}h `;
    if (m > 0 || h > 0) str += `${m}m `;
    str += `${s}s`;
    
    return { seconds: sec, formatted: str.trim() || "0s" };
  };

  const isTaskOfInterest = (taskId, startMs, endMs) => {
    const list = getTaskTimestamps(taskId);
    
    for (const ts of list) {
      const tsMs = parseTs(ts.timestamp);
      if (Number.isNaN(tsMs)) continue;
      
      if (ts.type === 0 && tsMs <= endMs) {
        const nextEnd = list.find(t => parseTs(t.timestamp) > tsMs && t.type === 1);
        const endTimeMs = nextEnd ? parseTs(nextEnd.timestamp) : now;
        
        if (endTimeMs >= startMs) {
          return true;
        }
      }
    }
    
    return false;
  };

  const getActivityIntervals = (taskId, startMs, endMs) => {
    const list = getTaskTimestamps(taskId);
    const intervals = [];
    let activeStart = null;

    for (const ts of list) {
      const tsMs = parseTs(ts.timestamp);
      if (Number.isNaN(tsMs)) continue;

      if (ts.type === 0) {
        activeStart = { timestamp: ts.timestamp, ms: tsMs };
      } else if (ts.type === 1 && activeStart !== null) {
        if (tsMs >= startMs && activeStart.ms <= endMs) {
          intervals.push({
            start: activeStart.timestamp,
            end: ts.timestamp,
            startMs: activeStart.ms,
            endMs: tsMs,
            isOngoing: false,
          });
        }
        activeStart = null;
      }
    }

    if (activeStart !== null && activeStart.ms <= endMs) {
      const isOngoing = endMs >= now; 
      intervals.push({
        start: activeStart.timestamp,
        end: isOngoing ? null : null, 
        startMs: activeStart.ms,
        endMs: now,
        isOngoing: isOngoing,
      });
    }

    return intervals.sort((a, b) => a.startMs - b.startMs);
  };

  const calculateTagActiveTime = (tagId, startMs, endMs) => {
    const tasksWithTag = tasks.filter(task => {
      const taskTagIds = task.tags ? task.tags.split(",").map(Number) : [];
      return taskTagIds.includes(tagId);
    });

    let totalMs = 0;

    tasksWithTag.forEach(task => {
      const timeData = calculateActiveTimeInInterval(task.id, startMs, endMs);
      totalMs += timeData.seconds * 1000;
    });

    const sec = Math.floor(totalMs / 1000);
    if (sec < 0) return { seconds: 0, formatted: "0s" };

    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    let str = "";
    if (h > 0) str += `${h}h `;
    if (m > 0 || h > 0) str += `${m}m `;
    str += `${s}s`;
    
    return { seconds: sec, formatted: str.trim() || "0s" };
  };

  const processedTasks = useMemo(() => {
    const filteredByTag = tasks.filter((task) => {
      if (filterTags.length === 0) return true;
      const taskTagIds = task.tags ? task.tags.split(",").map(Number) : [];
      const taskTagNames = tags
        .filter((t) => taskTagIds.includes(t.id))
        .map((t) => t.name.toLowerCase());
      return filterTags.every((ft) => taskTagNames.includes(ft));
    });

    return filteredByTag.map((task) => ({
      ...task,
      isActive: isTaskActive(task.id),
      accumulatedTime: calculateAccumulatedTime(task.id),
    }));
  }, [tasks, tags, filterTags, timestamps, now]);

  const sortedTasks = useMemo(() => {
    return [...processedTasks].sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return 0;
    });
  }, [processedTasks]);

  const tasksOfInterest = useMemo(() => {
    const startMs = new Date(observationStart).getTime();
    const endMs = new Date(observationEnd).getTime();
    
    if (isNaN(startMs) || isNaN(endMs) || startMs >= endMs) {
      return [];
    }

    return tasks
      .filter(task => isTaskOfInterest(task.id, startMs, endMs))
      .map(task => ({
        ...task,
        activeTime: calculateActiveTimeInInterval(task.id, startMs, endMs),
      }))
      .sort((a, b) => b.activeTime.seconds - a.activeTime.seconds);
  }, [tasks, timestamps, observationStart, observationEnd, now]);

  const tagsOfInterest = useMemo(() => {
    const startMs = new Date(tagObservationStart).getTime();
    const endMs = new Date(tagObservationEnd).getTime();
    
    if (isNaN(startMs) || isNaN(endMs) || startMs >= endMs) {
      return [];
    }

    const activeTags = tags.filter(tag => {
      const tasksWithTag = tasks.filter(task => {
        const taskTagIds = task.tags ? task.tags.split(",").map(Number) : [];
        return taskTagIds.includes(tag.id);
      });
      
      return tasksWithTag.some(task => isTaskOfInterest(task.id, startMs, endMs));
    });

    return activeTags
      .map(tag => ({
        ...tag,
        activeTime: calculateTagActiveTime(tag.id, startMs, endMs),
      }))
      .filter(tag => tag.activeTime.seconds > 0)
      .sort((a, b) => b.activeTime.seconds - a.activeTime.seconds);
  }, [tags, tasks, timestamps, tagObservationStart, tagObservationEnd, now]);

  const [editableIntervals, setEditableIntervals] = useState([]);
  const [isEditingIntervals, setIsEditingIntervals] = useState(false);
  const [newIntervalStart, setNewIntervalStart] = useState("");
  const [newIntervalEnd, setNewIntervalEnd] = useState("");

  const activityIntervals = useMemo(() => {
    if (!selectedTaskForDetails) return [];
    
    const startMs = new Date(taskDetailsStart).getTime();
    const endMs = new Date(taskDetailsEnd).getTime();
    
    if (isNaN(startMs) || isNaN(endMs) || startMs >= endMs) {
      return [];
    }

    return getActivityIntervals(selectedTaskForDetails.id, startMs, endMs);
  }, [selectedTaskForDetails, timestamps, taskDetailsStart, taskDetailsEnd, now]);

  const calculateDailyActiveTimes = useMemo(() => {
    if (!selectedTaskForChart) return [];

    const start = new Date(chartStartDate);
    const end = new Date(chartEndDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return [];
    }

    const dailyData = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const dayStartMs = dayStart.getTime();
      const dayEndMs = dayEnd.getTime();

      const activeTime = calculateActiveTimeInInterval(
        selectedTaskForChart.id,
        dayStartMs,
        dayEndMs
      );

      dailyData.push({
        date: new Date(currentDate).toISOString().slice(0, 10),
        displayDate: `${currentDate.getDate()}.${currentDate.getMonth() + 1}`,
        seconds: activeTime.seconds,
        formatted: activeTime.formatted,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dailyData;
  }, [selectedTaskForChart, chartStartDate, chartEndDate, timestamps, now]);

  useEffect(() => {
    if (isEditingIntervals && selectedTaskForDetails) {
      const intervals = activityIntervals
        .filter(interval => !interval.isOngoing)
        .map((interval, idx) => ({
          id: `interval-${idx}`,
          start: interval.start,
          end: interval.end || interval.start,
          startMs: parseTs(interval.start),
          endMs: interval.end ? parseTs(interval.end) : parseTs(interval.start),
        }));
      setEditableIntervals(intervals);
    }
  }, [isEditingIntervals, selectedTaskForDetails]);

  const detectOverlaps = (intervals) => {
    const overlaps = new Set();
    
    for (let i = 0; i < intervals.length; i++) {
      for (let j = i + 1; j < intervals.length; j++) {
        const a = intervals[i];
        const b = intervals[j];
        
        if (a.startMs < b.endMs && b.startMs < a.endMs) {
          overlaps.add(a.id);
          overlaps.add(b.id);
        }
      }
    }
    
    return overlaps;
  };

  const overlappingIntervals = useMemo(() => {
    return detectOverlaps(editableIntervals);
  }, [editableIntervals]);

  const handleIntervalChange = (id, field, value) => {
    setEditableIntervals(prev => prev.map(interval => {
      if (interval.id === id) {
        const updated = { ...interval, [field]: value };
        if (field === 'start') {
          updated.startMs = parseTs(value);
        } else if (field === 'end') {
          updated.endMs = parseTs(value);
        }
        return updated;
      }
      return interval;
    }));
  };

  const handleAddInterval = () => {
    if (!newIntervalStart || !newIntervalEnd) {
      alert("Please provide both start and end times");
      return;
    }

    const startMs = parseTs(newIntervalStart);
    const endMs = parseTs(newIntervalEnd);

    if (isNaN(startMs) || isNaN(endMs)) {
      alert("Invalid date format");
      return;
    }

    if (startMs >= endMs) {
      alert("Start time must be before end time");
      return;
    }

    const newInterval = {
      id: `interval-${Date.now()}`,
      start: newIntervalStart,
      end: newIntervalEnd,
      startMs,
      endMs,
    };

    setEditableIntervals(prev => [...prev, newInterval].sort((a, b) => a.startMs - b.startMs));
    setNewIntervalStart("");
    setNewIntervalEnd("");
  };

  const handleRemoveInterval = (id) => {
    setEditableIntervals(prev => prev.filter(interval => interval.id !== id));
  };

  const handleSaveIntervals = async () => {
    if (!selectedTaskForDetails) return;

    if (overlappingIntervals.size > 0) {
      if (!window.confirm("There are overlapping intervals. Do you want to save anyway?")) {
        return;
      }
    }

    for (const interval of editableIntervals) {
      if (isNaN(interval.startMs) || isNaN(interval.endMs)) {
        alert("Some intervals have invalid date formats");
        return;
      }
      if (interval.startMs >= interval.endMs) {
        alert("All intervals must have start time before end time");
        return;
      }
    }

    try {
      const taskTimestamps = timestamps.filter((ts) => ts.task === selectedTaskForDetails.id);
      for (const ts of taskTimestamps) {
        await fetch(`http://localhost:3010/timestamps/${ts.id}`, { method: "DELETE" });
      }

      for (const interval of editableIntervals) {
        await fetch("http://localhost:3010/timestamps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: interval.start,
            task: selectedTaskForDetails.id,
            type: 0,
          }),
        });

        await fetch("http://localhost:3010/timestamps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: interval.end,
            task: selectedTaskForDetails.id,
            type: 1,
          }),
        });
      }

      await fetchTimestamps();
      setIsEditingIntervals(false);
      alert("Activity intervals saved successfully!");
    } catch (error) {
      console.error("Error saving intervals:", error);
      alert("Failed to save intervals. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingIntervals(false);
    setEditableIntervals([]);
    setNewIntervalStart("");
    setNewIntervalEnd("");
  };

  return (
    <div style={{ 
      background: "white", 
      color: colors.pageText,
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      padding: isMobile ? "15px" : "30px",
      maxWidth: isSmall ? "100%" : "1100px",
      margin: "0 auto",
      overflowX: "hidden"
    }}>
      <h2 style={{ 
        fontSize: isSmall ? "1.3em" : "1.8em",
        margin: "0 0 20px 0",
        color: "#667eea",
        textAlign: "center",
        fontWeight: "700"
      }}>
        📝 Tasks Manager
      </h2>

      <div style={{ 
        display: "flex", 
        gap: "10px", 
        marginBottom: "20px", 
        flexWrap: "wrap",
        justifyContent: "center"
      }}>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ 
            flex: isSmall ? "1 1 100%" : "0 0 auto",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: showForm ? "#e74c3c" : "#667eea",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: isSmall ? "0.9em" : "1em",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
        >
          {showForm ? "❌ Cancel" : isSmall ? "➕" : "➕ Add Task"}
        </button>
        <button 
          onClick={() => setShowTagManager(!showTagManager)}
          style={{ 
            flex: isSmall ? "1 1 100%" : "0 0 auto",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: showTagManager ? "#e74c3c" : "#667eea",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: isSmall ? "0.9em" : "1em",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
        >
          {showTagManager ? "❌ Close" : isSmall ? "🏷️" : "🏷️ Manage Tags"}
        </button>
        <button 
          onClick={() => setShowSummary(!showSummary)} 
          style={{ 
            background: showSummary ? "#e74c3c" : "#3498db", 
            color: "white",
            flex: isSmall ? "1 1 100%" : "0 0 auto",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: isSmall ? "0.9em" : "1em",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
        >
          {showSummary ? "❌ Hide" : isSmall ? "📊" : "📊 Task Summary"}
        </button>
        <button 
          onClick={() => setShowTagSummary(!showTagSummary)} 
          style={{ 
            background: showTagSummary ? "#e74c3c" : "#9b59b6", 
            color: "white",
            flex: isSmall ? "1 1 100%" : "0 0 auto",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: isSmall ? "0.9em" : "1em",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
        >
          {showTagSummary ? "❌ Hide" : isSmall ? "🏷️📊" : "🏷️ Tag Summary"}
        </button>
        <button 
          onClick={() => setShowDailyChart(!showDailyChart)} 
          style={{ 
            background: showDailyChart ? "#e74c3c" : "#e67e22", 
            color: "white",
            flex: isSmall ? "1 1 100%" : "0 0 auto",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: isSmall ? "0.9em" : "1em",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
        >
          {showDailyChart ? "❌ Hide" : isSmall ? "📈" : "📈 Daily Chart"}
        </button>
      </div>

      {showDailyChart && (
        <div style={{ 
          border: "2px solid #e67e22", 
          borderRadius: "10px", 
          padding: isMobile ? "10px" : "15px", 
          marginBottom: "20px",
          background: "#fef5e7"
        }}>
          <h3 style={{ marginTop: 0, fontSize: isSmall ? "1em" : "1.2em" }}>📊 Daily Activity Chart</h3>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: isSmall ? "0.9em" : "1em" }}>
              Select Task:
            </label>
            <select
              value={selectedTaskForChart?.id || ""}
              onChange={(e) => {
                const task = tasks.find(t => t.id === parseInt(e.target.value));
                setSelectedTaskForChart(task || null);
              }}
              style={{
                padding: isSmall ? "6px" : "8px",
                borderRadius: "6px",
                border: `1px solid ${colors.inputBorder}`,
                background: colors.inputBg,
                color: colors.pageText,
                width: "100%",
                maxWidth: isSmall ? "100%" : "300px",
                fontSize: isSmall ? "0.9em" : "1em",
              }}
            >
              <option value="">-- Select a task --</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>{task.name}</option>
              ))}
            </select>
          </div>

          {selectedTaskForChart && (
            <>
              <div style={{ 
                display: "flex", 
                gap: isSmall ? "10px" : "15px", 
                marginBottom: "15px", 
                flexWrap: "wrap",
                flexDirection: isSmall ? "column" : "row"
              }}>
                <div style={{ flex: isSmall ? "1" : "0 0 auto" }}>
                  <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", color: "#2c3e50", fontSize: isSmall ? "0.85em" : "1em" }}>
                    Start Date:
                  </label>
                  <input
                    type="date"
                    value={chartStartDate}
                    onChange={(e) => setChartStartDate(e.target.value)}
                    style={{
                      padding: isSmall ? "6px" : "8px",
                      borderRadius: "6px",
                      border: `1px solid ${colors.inputBorder}`,
                      background: colors.inputBg,
                      color: colors.pageText,
                      width: isSmall ? "100%" : "auto",
                      fontSize: isSmall ? "0.9em" : "1em",
                    }}
                  />
                </div>
                
                <div style={{ flex: isSmall ? "1" : "0 0 auto" }}>
                  <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", color: "#2c3e50", fontSize: isSmall ? "0.85em" : "1em" }}>
                    End Date:
                  </label>
                  <input
                    type="date"
                    value={chartEndDate}
                    onChange={(e) => setChartEndDate(e.target.value)}
                    style={{
                      padding: isSmall ? "6px" : "8px",
                      borderRadius: "6px",
                      border: `1px solid ${colors.inputBorder}`,
                      background: colors.inputBg,
                      color: colors.pageText,
                      width: isSmall ? "100%" : "auto",
                      fontSize: isSmall ? "0.9em" : "1em",
                    }}
                  />
                </div>

                <div style={{ flex: isSmall ? "1" : "0 0 auto" }}>
                  <button
                    onClick={() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const offset = today.getTimezoneOffset() * 60000;
                      const todayStr = new Date(today - offset).toISOString().slice(0, 10);
                      
                      const sevenDaysAgo = new Date();
                      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
                      sevenDaysAgo.setHours(0, 0, 0, 0);
                      const sevenDaysAgoStr = new Date(sevenDaysAgo - offset).toISOString().slice(0, 10);
                      
                      setChartStartDate(sevenDaysAgoStr);
                      setChartEndDate(todayStr);
                    }}
                    style={{ 
                      marginTop: isSmall ? "0" : "28px", 
                      padding: isSmall ? "8px 12px" : "8px 12px",
                      width: isSmall ? "100%" : "auto",
                      fontSize: isSmall ? "0.9em" : "1em"
                    }}
                  >
                    Last 7 Days
                  </button>
                </div>
              </div>

              <div style={{ 
                background: "white", 
                borderRadius: "8px", 
                padding: isMobile ? "10px" : "15px",
                overflowX: "auto"
              }}>
                <h4 style={{ 
                  marginTop: 0, 
                  marginBottom: "15px",
                  fontSize: isSmall ? "0.95em" : "1.1em",
                  wordBreak: "break-word"
                }}>
                  {isSmall ? "Daily:" : "Daily Active Time:"} {selectedTaskForChart.name}
                </h4>
                
                {calculateDailyActiveTimes.length > 0 ? (
                  <div>
                    {!isSmall && (
                      <div style={{ 
                        display: "flex", 
                        alignItems: "flex-end", 
                        gap: isMobile ? "2px" : "4px", 
                        height: isMobile ? "180px" : "250px",
                        borderBottom: "2px solid #333",
                        borderLeft: "2px solid #333",
                        paddingLeft: isMobile ? "5px" : "10px",
                        paddingBottom: "5px",
                        marginBottom: "10px",
                        overflowX: "auto"
                      }}>
                        {(() => {
                          const maxSeconds = Math.max(...calculateDailyActiveTimes.map(d => d.seconds), 1);
                          return calculateDailyActiveTimes.map((day, idx) => {
                            const heightPercent = maxSeconds > 0 ? (day.seconds / maxSeconds) * 100 : 0;
                            const chartHeight = isMobile ? 160 : 230;
                            const barHeight = (heightPercent / 100) * chartHeight;
                            
                            return (
                              <div
                                key={day.date}
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "flex-end",
                                  minWidth: isMobile ? "25px" : "30px",
                                }}
                              >
                                <div
                                  style={{
                                    width: "100%",
                                    height: `${barHeight}px`,
                                    background: day.seconds > 0 
                                      ? "linear-gradient(to top, #e67e22, #f39c12)" 
                                      : "#e0e0e0",
                                    borderRadius: "4px 4px 0 0",
                                    position: "relative",
                                    cursor: "pointer",
                                  }}
                                  title={`${day.date}: ${day.formatted}`}
                                >
                                  {day.seconds > 0 && !isMobile && (
                                    <span style={{
                                      position: "absolute",
                                      top: "-20px",
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                      fontSize: "0.65em",
                                      fontWeight: "bold",
                                      whiteSpace: "nowrap",
                                    }}>
                                      {day.formatted}
                                    </span>
                                  )}
                                </div>
                                <div style={{
                                  marginTop: "5px",
                                  fontSize: isMobile ? "0.6em" : "0.75em",
                                  transform: "rotate(-45deg)",
                                  transformOrigin: "top left",
                                  whiteSpace: "nowrap",
                                  marginLeft: isMobile ? "10px" : "15px",
                                }}>
                                  {day.displayDate}
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}

                    <div style={{ overflowX: "auto" }}>
                      <table style={{ 
                        width: "100%", 
                        borderCollapse: "collapse", 
                        marginTop: isSmall ? "10px" : "20px",
                        fontSize: isSmall ? "0.85em" : "1em"
                      }}>
                        <thead>
                          <tr style={{ borderBottom: "2px solid #ddd" }}>
                            <th style={{ textAlign: "left", padding: isSmall ? "6px" : "8px" }}>Date</th>
                            <th style={{ textAlign: "right", padding: isSmall ? "6px" : "8px" }}>
                              {isSmall ? "Time" : "Active Time"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {calculateDailyActiveTimes.map((day) => (
                            <tr key={day.date} style={{ borderBottom: "1px solid #eee" }}>
                              <td style={{ padding: isSmall ? "6px" : "8px" }}>
                                {isSmall ? day.displayDate : day.date}
                              </td>
                              <td style={{ 
                                padding: isSmall ? "6px" : "8px", 
                                textAlign: "right", 
                                fontWeight: "bold" 
                              }}>
                                {day.formatted}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr style={{ borderTop: "2px solid #333", fontWeight: "bold" }}>
                            <td style={{ padding: isSmall ? "6px" : "8px" }}>Total</td>
                            <td style={{ padding: isSmall ? "6px" : "8px", textAlign: "right" }}>
                              {(() => {
                                const totalSeconds = calculateDailyActiveTimes.reduce((sum, d) => sum + d.seconds, 0);
                                const h = Math.floor(totalSeconds / 3600);
                                const m = Math.floor((totalSeconds % 3600) / 60);
                                const s = totalSeconds % 60;
                                let str = "";
                                if (h > 0) str += `${h}h `;
                                if (m > 0 || h > 0) str += `${m}m `;
                                str += `${s}s`;
                                return str.trim() || "0s";
                              })()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: "#888", fontStyle: "italic" }}>
                    No activity data for the selected period.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {selectedTaskForDetails && (
        <div style={{ 
          border: "2px solid #e67e22", 
          borderRadius: "10px", 
          padding: isMobile ? "10px" : "15px", 
          marginBottom: "20px",
          background: "#fef5e7"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "15px",
            flexWrap: "wrap",
            gap: "10px"
          }}>
            <h3 style={{ 
              margin: 0,
              fontSize: isSmall ? "0.95em" : "1.2em",
              wordBreak: "break-word",
              flex: "1 1 auto"
            }}>
              📋 {isSmall ? "Intervals:" : "Activity Intervals:"} {selectedTaskForDetails.name}
            </h3>
            <button
              onClick={() => setSelectedTaskForDetails(null)}
              style={{
                background: colors.deleteBg,
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: isSmall ? "4px 8px" : "6px 12px",
                cursor: "pointer",
                fontSize: isSmall ? "0.85em" : "1em"
              }}
            >
              Close
            </button>
          </div>
          
          <div style={{ 
            display: "flex", 
            gap: isSmall ? "10px" : "15px", 
            marginBottom: "15px", 
            flexWrap: "wrap",
            flexDirection: isSmall ? "column" : "row"
          }}>
            <div style={{ flex: isSmall ? "1" : "0 0 auto" }}>
              <label style={{ 
                display: "block", 
                fontWeight: "bold", 
                marginBottom: "5px", 
                color: "#2c3e50",
                fontSize: isSmall ? "0.85em" : "1em"
              }}>
                Start:
              </label>
              <input
                type="datetime-local"
                value={taskDetailsStart}
                onChange={(e) => setTaskDetailsStart(e.target.value)}
                style={{
                  padding: isSmall ? "6px" : "8px",
                  borderRadius: "6px",
                  border: `1px solid ${colors.inputBorder}`,
                  background: colors.inputBg,
                  color: colors.pageText,
                  width: isSmall ? "100%" : "auto",
                  fontSize: isSmall ? "0.9em" : "1em"
                }}
              />
            </div>
            
            <div style={{ flex: isSmall ? "1" : "0 0 auto" }}>
              <label style={{ 
                display: "block", 
                fontWeight: "bold", 
                marginBottom: "5px", 
                color: "#2c3e50",
                fontSize: isSmall ? "0.85em" : "1em"
              }}>
                End:
              </label>
              <input
                type="datetime-local"
                value={taskDetailsEnd}
                onChange={(e) => setTaskDetailsEnd(e.target.value)}
                style={{
                  padding: isSmall ? "6px" : "8px",
                  borderRadius: "6px",
                  border: `1px solid ${colors.inputBorder}`,
                  background: colors.inputBg,
                  color: colors.pageText,
                  width: isSmall ? "100%" : "auto",
                  fontSize: isSmall ? "0.9em" : "1em"
                }}
              />
            </div>

            <button
              onClick={() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const offset = today.getTimezoneOffset() * 60000;
                const localStart = new Date(today - offset).toISOString().slice(0, 16);
                
                const now = new Date();
                const nowOffset = now.getTimezoneOffset() * 60000;
                const localEnd = new Date(now - nowOffset).toISOString().slice(0, 16);
                
                setTaskDetailsStart(localStart);
                setTaskDetailsEnd(localEnd);
              }}
              style={{ 
                marginTop: isSmall ? "0" : "28px", 
                padding: isSmall ? "8px 12px" : "8px 12px",
                width: isSmall ? "100%" : "auto",
                fontSize: isSmall ? "0.9em" : "1em"
              }}
            >
              {isSmall ? "🔄 Today" : "Reset to Today"}
            </button>
          </div>

          <div style={{ background: "white", borderRadius: "8px", padding: isMobile ? "8px" : "10px" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: isSmall ? "flex-start" : "center", 
              marginBottom: "10px",
              flexDirection: isSmall ? "column" : "row",
              gap: "10px"
            }}>
              <h4 style={{ 
                margin: 0,
                fontSize: isSmall ? "0.95em" : "1.1em"
              }}>
                {isSmall ? "Intervals:" : "Activity Intervals (Chronological Order):"}
              </h4>
              {!isEditingIntervals && activityIntervals.some(i => !i.isOngoing) && (
                <button
                  onClick={() => setIsEditingIntervals(true)}
                  style={{
                    background: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: isSmall ? "6px 10px" : "6px 12px",
                    cursor: "pointer",
                    fontSize: isSmall ? "0.85em" : "1em",
                    width: isSmall ? "100%" : "auto"
                  }}
                >
                  ✏️ {isSmall ? "Edit" : "Edit Intervals"}
                </button>
              )}
              {isEditingIntervals && (
                <div style={{ 
                  display: "flex", 
                  gap: "8px",
                  flexDirection: isSmall ? "column" : "row",
                  width: isSmall ? "100%" : "auto"
                }}>
                  <button
                    onClick={handleSaveIntervals}
                    style={{
                      background: colors.btnStartBg,
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: isSmall ? "6px 10px" : "6px 12px",
                      cursor: "pointer",
                      fontSize: isSmall ? "0.85em" : "1em",
                      width: isSmall ? "100%" : "auto"
                    }}
                  >
                    💾 {isSmall ? "Save" : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      background: "#95a5a6",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: isSmall ? "6px 10px" : "6px 12px",
                      cursor: "pointer",
                      fontSize: isSmall ? "0.85em" : "1em",
                      width: isSmall ? "100%" : "auto"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {overlappingIntervals.size > 0 && isEditingIntervals && (
              <div style={{
                background: "#ffe6e6",
                border: "1px solid #ff4444",
                borderRadius: "6px",
                padding: isMobile ? "8px" : "10px",
                marginBottom: "10px",
                color: "#cc0000",
                fontSize: isSmall ? "0.85em" : "1em"
              }}>
                ⚠️ {isSmall ? `${overlappingIntervals.size} overlap(s)` : `Warning: ${overlappingIntervals.size} interval(s) have time overlaps (highlighted in red)`}
              </div>
            )}

            {!isEditingIntervals ? (
              activityIntervals.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isSmall ? "0.85em" : "1em" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #ddd" }}>
                      <th style={{ textAlign: "left", padding: isSmall ? "6px 4px" : "8px" }}>
                        {isSmall ? "Start" : "Start Time"}
                      </th>
                      <th style={{ textAlign: "left", padding: isSmall ? "6px 4px" : "8px" }}>
                        {isSmall ? "End" : "End Time"}
                      </th>
                      <th style={{ textAlign: "left", padding: isSmall ? "6px 4px" : "8px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityIntervals.map((interval, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ 
                          padding: isSmall ? "6px 4px" : "8px", 
                          fontFamily: "monospace",
                          fontSize: isSmall ? "0.9em" : "1em"
                        }}>
                          {formatTimestamp(interval.start)}
                        </td>
                        <td style={{ 
                          padding: isSmall ? "6px 4px" : "8px", 
                          fontFamily: "monospace",
                          fontSize: isSmall ? "0.9em" : "1em"
                        }}>
                          {interval.isOngoing ? (
                            <span style={{ color: colors.cardBorderActive, fontWeight: "bold" }}>
                              Ongoing...
                            </span>
                          ) : interval.end ? (
                            formatTimestamp(interval.end)
                          ) : (
                            <span style={{ color: "#888", fontStyle: "italic" }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: isSmall ? "6px 4px" : "8px" }}>
                          {interval.isOngoing ? (
                            <span style={{
                              backgroundColor: colors.cardBorderActive,
                              color: "white",
                              padding: isSmall ? "1px 6px" : "2px 8px",
                              borderRadius: "8px",
                              fontSize: isSmall ? "0.75em" : "0.85em",
                            }}>
                              {isSmall ? "ACT" : "ACTIVE"}
                            </span>
                          ) : (
                            <span style={{
                              backgroundColor: "#95a5a6",
                              color: "white",
                              padding: isSmall ? "1px 6px" : "2px 8px",
                              borderRadius: "8px",
                              fontSize: isSmall ? "0.75em" : "0.85em",
                            }}>
                              {isSmall ? "DONE" : "COMPLETED"}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: "#888", fontStyle: "italic", fontSize: isSmall ? "0.9em" : "1em" }}>
                  {isSmall ? "No intervals found." : "No activity intervals found in this period."}
                </p>
              )
            ) : (
              <div>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "15px", fontSize: isSmall ? "0.85em" : "1em" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #ddd" }}>
                      <th style={{ textAlign: "left", padding: isSmall ? "6px 4px" : "8px" }}>
                        {isSmall ? "Start" : "Start Time"}
                      </th>
                      <th style={{ textAlign: "left", padding: isSmall ? "6px 4px" : "8px" }}>
                        {isSmall ? "End" : "End Time"}
                      </th>
                      {!isSmall && (
                        <th style={{ textAlign: "center", padding: "8px", width: "80px" }}>Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {editableIntervals.map((interval) => {
                      const hasOverlap = overlappingIntervals.has(interval.id);
                      return (
                        <tr 
                          key={interval.id} 
                          style={{ 
                            borderBottom: "1px solid #eee",
                            backgroundColor: hasOverlap ? "#ffcccc" : "transparent",
                          }}
                        >
                          <td style={{ padding: isSmall ? "6px 4px" : "8px" }}>
                            <input
                              type="datetime-local"
                              value={interval.start.replace(" ", "T").slice(0, 16)}
                              onChange={(e) => {
                                const newVal = e.target.value.replace("T", " ") + ":00";
                                handleIntervalChange(interval.id, "start", newVal);
                              }}
                              style={{
                                padding: isSmall ? "3px" : "4px",
                                border: hasOverlap ? "2px solid #ff4444" : "1px solid #ccc",
                                borderRadius: "4px",
                                width: "100%",
                                fontSize: isSmall ? "0.85em" : "1em"
                              }}
                            />
                          </td>
                          <td style={{ padding: isSmall ? "6px 4px" : "8px" }}>
                            <input
                              type="datetime-local"
                              value={interval.end.replace(" ", "T").slice(0, 16)}
                              onChange={(e) => {
                                const newVal = e.target.value.replace("T", " ") + ":00";
                                handleIntervalChange(interval.id, "end", newVal);
                              }}
                              style={{
                                padding: isSmall ? "3px" : "4px",
                                border: hasOverlap ? "2px solid #ff4444" : "1px solid #ccc",
                                borderRadius: "4px",
                                width: "100%",
                                fontSize: isSmall ? "0.85em" : "1em"
                              }}
                            />
                          </td>
                          {!isSmall && (
                            <td style={{ padding: "8px", textAlign: "center" }}>
                              <button
                                onClick={() => handleRemoveInterval(interval.id)}
                                style={{
                                  background: colors.deleteBg,
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "4px 8px",
                                  cursor: "pointer",
                                  fontSize: "0.85em",
                                }}
                              >
                                🗑️ Remove
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    {isSmall && editableIntervals.map((interval) => (
                      <tr key={`remove-${interval.id}`}>
                        <td colSpan="2" style={{ padding: "4px" }}>
                          <button
                            onClick={() => handleRemoveInterval(interval.id)}
                            style={{
                              background: colors.deleteBg,
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "4px 8px",
                              cursor: "pointer",
                              fontSize: "0.8em",
                              width: "100%"
                            }}
                          >
                            🗑️ Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{
                  border: "2px dashed #3498db",
                  borderRadius: "8px",
                  padding: isMobile ? "10px" : "15px",
                  background: "#f0f8ff",
                }}>
                  <h5 style={{ 
                    marginTop: 0, 
                    marginBottom: "10px", 
                    color: "#2c3e50",
                    fontSize: isSmall ? "0.9em" : "1em"
                  }}>
                    ➕ {isSmall ? "Add Interval" : "Add New Activity Interval"}
                  </h5>
                  <div style={{ 
                    display: "flex", 
                    gap: "10px", 
                    alignItems: "flex-end", 
                    flexWrap: "wrap",
                    flexDirection: isSmall ? "column" : "row"
                  }}>
                    <div style={{ flex: isSmall ? "1" : "0 0 auto", width: isSmall ? "100%" : "auto" }}>
                      <label style={{ 
                        display: "block", 
                        fontWeight: "bold", 
                        marginBottom: "5px", 
                        fontSize: isSmall ? "0.85em" : "0.9em"
                      }}>
                        {isSmall ? "Start:" : "Start Time:"}
                      </label>
                      <input
                        type="datetime-local"
                        value={newIntervalStart.replace(" ", "T").slice(0, 16)}
                        onChange={(e) => setNewIntervalStart(e.target.value.replace("T", " ") + ":00")}
                        style={{
                          padding: isSmall ? "5px" : "6px",
                          border: "1px solid #3498db",
                          borderRadius: "4px",
                          width: isSmall ? "100%" : "auto",
                          fontSize: isSmall ? "0.85em" : "1em"
                        }}
                      />
                    </div>
                    <div style={{ flex: isSmall ? "1" : "0 0 auto", width: isSmall ? "100%" : "auto" }}>
                      <label style={{ 
                        display: "block", 
                        fontWeight: "bold", 
                        marginBottom: "5px", 
                        fontSize: isSmall ? "0.85em" : "0.9em"
                      }}>
                        {isSmall ? "End:" : "End Time:"}
                      </label>
                      <input
                        type="datetime-local"
                        value={newIntervalEnd.replace(" ", "T").slice(0, 16)}
                        onChange={(e) => setNewIntervalEnd(e.target.value.replace("T", " ") + ":00")}
                        style={{
                          padding: isSmall ? "5px" : "6px",
                          border: "1px solid #3498db",
                          borderRadius: "4px",
                          width: isSmall ? "100%" : "auto",
                          fontSize: isSmall ? "0.85em" : "1em"
                        }}
                      />
                    </div>
                    <button
                      onClick={handleAddInterval}
                      style={{
                        background: "#3498db",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: isSmall ? "8px 12px" : "8px 16px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        width: isSmall ? "100%" : "auto",
                        fontSize: isSmall ? "0.9em" : "1em"
                      }}
                    >
                      ➕ {isSmall ? "Add" : "Add Interval"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showSummary && (
        <div style={{ 
          border: "2px solid #3498db", 
          borderRadius: "10px", 
          padding: isMobile ? "10px" : "15px", 
          marginBottom: "20px",
          background: "#e8f4f8"
        }}>
          <h3 style={{ 
            marginTop: 0,
            fontSize: isSmall ? "1em" : "1.2em"
          }}>
            📊 {isSmall ? "Task Summary" : "Task Activity Summary"}
          </h3>
          
          <div style={{ 
            display: "flex", 
            gap: isSmall ? "10px" : "15px", 
            marginBottom: "15px", 
            flexWrap: "wrap",
            flexDirection: isSmall ? "column" : "row"
          }}>
            <div style={{ flex: isSmall ? "1" : "0 0 auto" }}>
              <label style={{ 
                display: "block", 
                fontWeight: "bold", 
                marginBottom: "5px", 
                color: "#2c3e50",
                fontSize: isSmall ? "0.85em" : "1em"
              }}>
                Start:
              </label>
              <input
                type="datetime-local"
                value={observationStart}
                onChange={(e) => setObservationStart(e.target.value)}
                style={{
                  padding: isSmall ? "6px" : "8px",
                  borderRadius: "6px",
                  border: `1px solid ${colors.inputBorder}`,
                  background: colors.inputBg,
                  color: colors.pageText,
                  width: isSmall ? "100%" : "auto",
                  fontSize: isSmall ? "0.9em" : "1em"
                }}
              />
            </div>
            
            <div style={{ flex: isSmall ? "1" : "0 0 auto" }}>
              <label style={{ 
                display: "block", 
                fontWeight: "bold", 
                marginBottom: "5px", 
                color: "#2c3e50",
                fontSize: isSmall ? "0.85em" : "1em"
              }}>
                End:
              </label>
              <input
                type="datetime-local"
                value={observationEnd}
                onChange={(e) => setObservationEnd(e.target.value)}
                style={{
                  padding: isSmall ? "6px" : "8px",
                  borderRadius: "6px",
                  border: `1px solid ${colors.inputBorder}`,
                  background: colors.inputBg,
                  color: colors.pageText,
                  width: isSmall ? "100%" : "auto",
                  fontSize: isSmall ? "0.9em" : "1em"
                }}
              />
            </div>

            <button
              onClick={() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const offset = today.getTimezoneOffset() * 60000;
                const localStart = new Date(today - offset).toISOString().slice(0, 16);
                
                const now = new Date();
                const nowOffset = now.getTimezoneOffset() * 60000;
                const localEnd = new Date(now - nowOffset).toISOString().slice(0, 16);
                
                setObservationStart(localStart);
                setObservationEnd(localEnd);
              }}
              style={{ 
                marginTop: isSmall ? "0" : "28px", 
                padding: isSmall ? "8px 12px" : "8px 12px",
                width: isSmall ? "100%" : "auto",
                fontSize: isSmall ? "0.9em" : "1em"
              }}
            >
              {isSmall ? "🔄 Today" : "Reset to Today"}
            </button>
          </div>

          <div style={{ background: "white", borderRadius: "8px", padding: isMobile ? "8px" : "10px" }}>
            <h4 style={{ 
              marginTop: 0,
              fontSize: isSmall ? "0.95em" : "1.1em"
            }}>
              {isSmall ? "Active Tasks:" : "Tasks Active During This Period:"}
            </h4>
            {tasksOfInterest.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isSmall ? "0.85em" : "1em" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #ddd" }}>
                    <th style={{ textAlign: "left", padding: isSmall ? "6px 4px" : "8px" }}>
                      {isSmall ? "Task" : "Task Name"}
                    </th>
                    {!isSmall && (
                      <th style={{ textAlign: "left", padding: "8px" }}>Tags</th>
                    )}
                    <th style={{ textAlign: "right", padding: isSmall ? "6px 4px" : "8px" }}>
                      {isSmall ? "Time" : "Active Time"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasksOfInterest.map((task) => {
                    const taskTagIds = task.tags ? task.tags.split(",").map(Number) : [];
                    const taskTagNames = tags
                      .filter(t => taskTagIds.includes(t.id))
                      .map(t => t.name);
                    
                    return (
                      <tr key={task.id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: isSmall ? "6px 4px" : "8px" }}>
                          {task.name}
                          {isSmall && taskTagNames.length > 0 && (
                            <div style={{ fontSize: "0.8em", color: "#666", marginTop: "2px" }}>
                              {taskTagNames.join(", ")}
                            </div>
                          )}
                        </td>
                        {!isSmall && (
                          <td style={{ padding: "8px" }}>
                            {taskTagNames.length > 0 ? taskTagNames.join(", ") : "-"}
                          </td>
                        )}
                        <td style={{ padding: isSmall ? "6px 4px" : "8px", textAlign: "right", fontWeight: "bold" }}>
                          {task.activeTime.formatted}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p style={{ color: "#888", fontStyle: "italic", fontSize: isSmall ? "0.9em" : "1em" }}>
                {isSmall ? "No active tasks." : "No tasks were active during this period."}
              </p>
            )}
          </div>
        </div>
      )}

      {showTagSummary && (
        <div style={{ 
          border: "2px solid #9b59b6", 
          borderRadius: "10px", 
          padding: isMobile ? "10px" : "15px", 
          marginBottom: "20px",
          background: "#f4ecf7"
        }}>
          <h3 style={{ 
            marginTop: 0,
            fontSize: isSmall ? "1em" : "1.2em"
          }}>
            🏷️ {isSmall ? "Tag Summary" : "Tag Activity Summary"}
          </h3>
          
          <div style={{ 
            display: "flex", 
            gap: isSmall ? "10px" : "15px", 
            marginBottom: "15px", 
            flexWrap: "wrap",
            flexDirection: isSmall ? "column" : "row"
          }}>
            <div style={{ flex: isSmall ? "1" : "0 0 auto" }}>
              <label style={{ 
                display: "block", 
                fontWeight: "bold", 
                marginBottom: "5px", 
                color: "#2c3e50",
                fontSize: isSmall ? "0.85em" : "1em"
              }}>
                Start:
              </label>
              <input
                type="datetime-local"
                value={tagObservationStart}
                onChange={(e) => setTagObservationStart(e.target.value)}
                style={{
                  padding: isSmall ? "6px" : "8px",
                  borderRadius: "6px",
                  border: `1px solid ${colors.inputBorder}`,
                  background: colors.inputBg,
                  color: colors.pageText,
                  width: isSmall ? "100%" : "auto",
                  fontSize: isSmall ? "0.9em" : "1em"
                }}
              />
            </div>
            
            <div style={{ flex: isSmall ? "1" : "0 0 auto" }}>
              <label style={{ 
                display: "block", 
                fontWeight: "bold", 
                marginBottom: "5px", 
                color: "#2c3e50",
                fontSize: isSmall ? "0.85em" : "1em"
              }}>
                End:
              </label>
              <input
                type="datetime-local"
                value={tagObservationEnd}
                onChange={(e) => setTagObservationEnd(e.target.value)}
                style={{
                  padding: isSmall ? "6px" : "8px",
                  borderRadius: "6px",
                  border: `1px solid ${colors.inputBorder}`,
                  background: colors.inputBg,
                  color: colors.pageText,
                  width: isSmall ? "100%" : "auto",
                  fontSize: isSmall ? "0.9em" : "1em"
                }}
              />
            </div>

            <button
              onClick={() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const offset = today.getTimezoneOffset() * 60000;
                const localStart = new Date(today - offset).toISOString().slice(0, 16);
                
                const now = new Date();
                const nowOffset = now.getTimezoneOffset() * 60000;
                const localEnd = new Date(now - nowOffset).toISOString().slice(0, 16);
                
                setTagObservationStart(localStart);
                setTagObservationEnd(localEnd);
              }}
              style={{ 
                marginTop: isSmall ? "0" : "28px", 
                padding: isSmall ? "8px 12px" : "8px 12px",
                width: isSmall ? "100%" : "auto",
                fontSize: isSmall ? "0.9em" : "1em"
              }}
            >
              {isSmall ? "🔄 Today" : "Reset to Today"}
            </button>
          </div>

          <div style={{ background: "white", borderRadius: "8px", padding: isMobile ? "8px" : "10px" }}>
            <h4 style={{ 
              marginTop: 0,
              fontSize: isSmall ? "0.95em" : "1.1em"
            }}>
              {isSmall ? "Active Tags:" : "Tags Active During This Period:"}
            </h4>
            {tagsOfInterest.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isSmall ? "0.85em" : "1em" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #ddd" }}>
                    <th style={{ textAlign: "left", padding: isSmall ? "6px 4px" : "8px" }}>
                      {isSmall ? "Tag" : "Tag Name"}
                    </th>
                    <th style={{ textAlign: "right", padding: isSmall ? "6px 4px" : "8px" }}>
                      {isSmall ? "Time" : "Total Active Time"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tagsOfInterest.map((tag) => (
                    <tr key={tag.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: isSmall ? "6px 4px" : "8px" }}>
                        <span style={{
                          backgroundColor: colors.tagBgActive,
                          color: colors.tagTextOnDark,
                          padding: isSmall ? "3px 8px" : "4px 10px",
                          borderRadius: "12px",
                          display: "inline-block",
                          fontSize: isSmall ? "0.9em" : "1em"
                        }}>
                          {tag.name}
                        </span>
                      </td>
                      <td style={{ padding: isSmall ? "6px 4px" : "8px", textAlign: "right", fontWeight: "bold" }}>
                        {tag.activeTime.formatted}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: "#888", fontStyle: "italic", fontSize: isSmall ? "0.9em" : "1em" }}>
                {isSmall ? "No active tags." : "No tags were active during this period."}
              </p>
            )}
          </div>
        </div>
      )}

      {/* FILTER */}
      <div style={{ 
        marginBottom: "20px",
        maxWidth: "800px",
        margin: "0 auto 20px auto"
      }}>
        <strong style={{ 
          fontSize: isSmall ? "0.95em" : "1.1em",
          display: "block",
          textAlign: "center",
          marginBottom: "10px",
          color: "#495057"
        }}>
          {isSmall ? "🔍 Tags:" : "🔍 Filter by tags:"}
        </strong>
        <div style={{ 
          display: "flex", 
          gap: "8px", 
          alignItems: "center", 
          marginTop: "8px", 
          flexWrap: "wrap",
          justifyContent: "center"
        }}>
          {filterTags.map((ft) => (
            <div
              key={ft}
              onClick={() => removeFilterTag(ft)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: isSmall ? "6px 10px" : "8px 14px",
                borderRadius: 20,
                background: "#667eea",
                color: "white",
                cursor: "pointer",
                textTransform: "capitalize",
                fontSize: isSmall ? "0.85em" : "0.95em",
                fontWeight: "500",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                transition: "all 0.2s ease"
              }}
            >
              <span>{ft}</span>
              <span style={{ fontWeight: 700, fontSize: "1.2em" }}>×</span>
            </div>
          ))}
          <input
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            onKeyDown={onFilterKeyDown}
            placeholder={isSmall ? "Add tag..." : "Type tag names and press Enter or comma"}
            style={{
              padding: isSmall ? "6px 10px" : "8px 14px",
              borderRadius: "20px",
              border: "2px solid #e9ecef",
              minWidth: isSmall ? "150px" : "220px",
              flex: isSmall ? "1 1 100%" : "0 0 auto",
              background: "white",
              color: colors.pageText,
              fontSize: isSmall ? "0.85em" : "0.95em",
              outline: "none",
              transition: "border-color 0.2s ease"
            }}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
            list="existing-tags"
          />
          <datalist id="existing-tags">
            {tags.map((t) => (
              <option key={t.id} value={t.name} />
            ))}
          </datalist>
        </div>
      </div>

      {showForm && (
        <form 
          onSubmit={handleAddTask} 
          style={{ 
            marginBottom: "20px",
            maxWidth: "600px",
            margin: "0 auto 20px auto",
            padding: "20px",
            background: "#f8f9fa",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <h3 style={{ 
            marginTop: 0, 
            marginBottom: "15px", 
            color: "#667eea",
            textAlign: "center",
            fontSize: isSmall ? "1.1em" : "1.3em"
          }}>
            ➕ Add New Task
          </h3>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ 
              display: "block", 
              fontWeight: "600", 
              marginBottom: "8px",
              fontSize: isSmall ? "0.9em" : "1em"
            }}>
              Task Name:
            </label>
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              required
              style={{ 
                border: `1px solid ${colors.inputBorder}`, 
                background: "white", 
                color: colors.pageText,
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                fontSize: isSmall ? "0.9em" : "1em",
                boxSizing: "border-box"
              }}
              placeholder="Enter task name..."
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <strong style={{ 
              display: "block", 
              marginBottom: "10px",
              fontSize: isSmall ? "0.9em" : "1em"
            }}>
              Select Tags:
            </strong>
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: "10px"
            }}>
              {tags.map((tag) => (
                <label 
                  key={tag.id} 
                  style={{ 
                    cursor: "pointer",
                    padding: "8px 12px",
                    background: selectedTagIds.includes(tag.id) ? "#667eea" : "#e9ecef",
                    color: selectedTagIds.includes(tag.id) ? "white" : "#495057",
                    borderRadius: "20px",
                    fontSize: isSmall ? "0.85em" : "0.95em",
                    fontWeight: "500",
                    transition: "all 0.2s ease"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedTagIds.includes(tag.id)}
                    onChange={() =>
                      setSelectedTagIds((prev) =>
                        prev.includes(tag.id) ? prev.filter((id) => id !== tag.id) : [...prev, tag.id]
                      )
                    }
                    style={{ marginRight: "6px" }}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>
          <button 
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: isSmall ? "0.95em" : "1.1em",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            💾 Save Task
          </button>
        </form>
      )}

      {showTagManager && (
        <div
          style={{
            border: "2px solid #667eea",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            background: "#f8f9fa",
            maxWidth: "800px",
            margin: "0 auto 20px auto",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <h3 style={{ 
            width: "100%", 
            textAlign: "center", 
            marginTop: 0, 
            marginBottom: "15px",
            color: "#667eea",
            fontSize: isSmall ? "1.1em" : "1.3em"
          }}>
            🏷️ Tag Manager
          </h3>
          {tags.map((tag) => (
            <div
              key={tag.id}
              style={{
                backgroundColor: colors.tagBgActive,
                color: colors.tagTextOnDark,
                padding: "8px 14px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: isSmall ? "0.9em" : "1em",
                fontWeight: "500"
              }}
            >
              <span>{tag.name}</span>
              <button
                onClick={() => handleDeleteTag(tag.id)}
                style={{ 
                  background: "rgba(255,255,255,0.3)", 
                  border: "none", 
                  color: "white", 
                  cursor: "pointer", 
                  fontWeight: "bold",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px"
                }}
              >
                ×
              </button>
            </div>
          ))}
          <form
            onSubmit={handleAddTag}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              padding: "8px 14px",
              borderRadius: "20px",
              border: "2px dashed #667eea"
            }}
          >
            <input
              type="text"
              placeholder="New tag name..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              style={{ 
                border: "none", 
                outline: "none", 
                background: "transparent", 
                color: colors.pageText,
                fontSize: isSmall ? "0.9em" : "1em",
                minWidth: "120px"
              }}
            />
            <button
              type="submit"
              style={{ 
                background: "#667eea", 
                border: "none", 
                color: "white",
                cursor: "pointer", 
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "bold"
              }}
            >
              +
            </button>
          </form>
        </div>
      )}

      {/* TASK LIST */}
      {sortedTasks.length > 0 ? (
        sortedTasks.map((task) => {
          const taskTagIds = task.tags ? task.tags.split(",").map(Number) : [];
          const { isActive, accumulatedTime } = task;
          return (
            <div
              key={task.id}
              style={{
                border: `2px solid ${isActive ? colors.cardBorderActive : colors.cardBorderInactive}`,
                margin: isMobile ? "6px 4px" : "8px",
                padding: isMobile ? "6px" : "8px",
                position: "relative",
                borderRadius: "8px",
                background: isActive ? colors.cardBgActive : colors.cardBgInactive,
              }}
            >
              <button
                onClick={() => handleDeleteTask(task.id)}
                style={{
                  position: "absolute",
                  right: isSmall ? "4px" : "8px",
                  top: isSmall ? "4px" : "8px",
                  backgroundColor: colors.deleteBg,
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  padding: isSmall ? "3px 6px" : "4px 8px",
                  fontSize: isSmall ? "0.85em" : "1em"
                }}
              >
                X
              </button>

              {editingTaskId === task.id ? (
                <div>
                  <input
                    type="text"
                    value={editedTaskName}
                    autoFocus
                    onChange={(e) => setEditedTaskName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(task.id);
                      if (e.key === "Escape") setEditingTaskId(null);
                    }}
                    style={{ 
                      border: `1px solid ${colors.inputBorder}`, 
                      background: colors.inputBg, 
                      color: colors.pageText,
                      fontSize: isSmall ? "0.9em" : "1em",
                      width: isSmall ? "100%" : "auto"
                    }}
                  />
                  <button 
                    onClick={() => handleSaveEdit(task.id)} 
                    style={{ 
                      marginLeft: "8px",
                      fontSize: isSmall ? "0.85em" : "1em",
                      padding: isSmall ? "4px 8px" : "6px 12px"
                    }}
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setEditingTaskId(null)} 
                    style={{ 
                      marginLeft: "4px",
                      fontSize: isSmall ? "0.85em" : "1em",
                      padding: isSmall ? "4px 8px" : "6px 12px"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={{ paddingRight: isSmall ? "35px" : "40px" }}>
                  <h3 
                    onDoubleClick={() => handleEditTask(task)} 
                    onClick={() => setSelectedTaskForDetails(task)}
                    style={{ 
                      cursor: "pointer", 
                      marginBottom: "4px",
                      fontSize: isSmall ? "1em" : "1.2em",
                      wordBreak: "break-word"
                    }}
                    title="Click to view activity intervals, double-click to edit"
                  >
                    {task.name}
                  </h3>
                  <div style={{ 
                    display: "flex", 
                    alignItems: isSmall ? "flex-start" : "center", 
                    gap: isSmall ? "5px" : "10px", 
                    marginBottom: "10px", 
                    fontWeight: "bold",
                    flexWrap: "wrap",
                    fontSize: isSmall ? "0.85em" : "1em"
                  }}>
                    <strong>{isSmall ? "" : "Status:"}</strong>
                    <span style={{ color: isActive ? colors.cardBorderActive : colors.cardBorderInactive }}>
                      {isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                    <span style={{ fontSize: isSmall ? "0.9em" : "0.9em", color: "#555" }}>({accumulatedTime})</span>
                    {!isActive ? (
                      <button 
                        onClick={() => handleStartActivity(task.id)} 
                        style={{ 
                          background: colors.btnStartBg, 
                          color: "white",
                          fontSize: isSmall ? "0.85em" : "1em",
                          padding: isSmall ? "4px 10px" : "6px 12px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        {isSmall ? "▶" : "Start"}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStopActivity(task.id)} 
                        style={{ 
                          background: colors.btnStopBg, 
                          color: "white",
                          fontSize: isSmall ? "0.85em" : "1em",
                          padding: isSmall ? "4px 10px" : "6px 12px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        {isSmall ? "⏸" : "Stop"}
                      </button>
                    )}
                    <button 
                      onClick={() => handleResetTime(task.id)} 
                      style={{ 
                        background: "#e74c3c", 
                        color: "white", 
                        fontSize: isSmall ? "0.75em" : "0.8em", 
                        padding: isSmall ? "3px 6px" : "4px 8px", 
                        marginLeft: isSmall ? "0" : "8px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                      title="Reset all time records"
                    >
                      🔄 {isSmall ? "" : "Reset"}
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: isSmall ? "6px" : "8px" }}>
                {tags.map((tag) => (
                  <label
                    key={tag.id}
                    style={{
                      backgroundColor: taskTagIds.includes(tag.id) ? colors.tagBgActive : colors.tagBgInactive,
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      padding: isSmall ? "3px 6px" : "4px 8px",
                      cursor: "pointer",
                      fontSize: isSmall ? "0.8em" : "1em"
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{ marginRight: "4px" }}
                      checked={taskTagIds.includes(tag.id)}
                      onChange={() => handleTaskTagToggle(task, tag.id)}
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <p style={{ 
          fontSize: isSmall ? "1em" : "1.2em",
          textAlign: "center",
          color: "#6c757d",
          marginTop: "40px",
          padding: "20px"
        }}>
          📝 No tasks found. Try adding one! 😊
        </p>
      )}
    </div>
  );
}