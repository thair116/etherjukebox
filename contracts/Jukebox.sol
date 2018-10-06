pragma solidity ^0.4.24;

contract Jukebox {
  string videoUrl;

  struct Video {
    string videoUrl;
    uint startTime;
    uint timeDuration;
  }

  Video[] public videoChain;

  event QueueUpdated(string videoUrl, uint startTime, uint timeDuration);

  function addToQueue(string _videoUrl, uint _timeDuration) 
  payable public
  {
    uint startTime;
    if (videoChain.length > 0) {
      Video endOfQueue = videoChain[videoChain.length-1];

      if (now > endOfQueue.startTime + endOfQueue.timeDuration) {
        // we have a gap, start the new video
        startTime = now;
      } else {
        // no gap, play later
        startTime = endOfQueue.startTime + endOfQueue.timeDuration;
      }
    } else {
      // first video, start now
      startTime = now;
    }

    Video memory newVideo = Video(
      {
        videoUrl: _videoUrl,
        timeDuration: _timeDuration * 1 seconds,
        startTime: startTime
      });  

    emit QueueUpdated(newVideo.videoUrl);
    videoChain.push(newVideo);
  } 

  function chainItem(uint index)
  public view
  returns (string videoUrl, uint startTime, uint timeDuration)
  {
    return (videoChain[index].videoUrl, videoChain[index].startTime, videoChain[index].timeDuration);
  }

  function chainLength()
  public view
  returns (uint length)
  {
    return videoChain.length;
  }
}

// TODO: Send funds to contract owner