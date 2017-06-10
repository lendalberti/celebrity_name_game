module ApplicationHelper

  def pDebug(p)
    logger.debug "\nDEBUG #{'⟱ ' * 50} DEBUG\n\n #{caller[0].inspect} \n"
    logger.debug p.to_yaml
    logger.debug "DEBUG #{'⟰ ' * 50} DEBUG\n"
  end

end
