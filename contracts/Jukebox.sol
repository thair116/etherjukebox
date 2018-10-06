pragma solidity ^0.4.24;

contract Jukebox {
  string videoUrl;

  event SongChanged(string videoUrl);

  function setVideoUrl(string _videoUrl) payable public {
    videoUrl = _videoUrl;
    emit SongChanged(_videoUrl);
  }

  function getVideoUrl() public view returns (string) {
    return videoUrl;
  }
}
