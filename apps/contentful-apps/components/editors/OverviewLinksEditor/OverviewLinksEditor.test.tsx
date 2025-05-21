describe('OverviewLinksEditor – additional tests', () => {
  let defaultProps;
  let onAddMock;
  let onRemoveMock;
  let onChangeMock;

  beforeEach(() => {
    onAddMock = jest.fn();
    onRemoveMock = jest.fn();
    onChangeMock = jest.fn();
    defaultProps = {
      links: [],
      onAdd: onAddMock,
      onRemove: onRemoveMock,
      onChange: onChangeMock,
      maxLinks: 5
    };
  });

  afterEach(() => {
    cleanup();
  });

  it('renders placeholder when links array is empty', () => {
    render(<OverviewLinksEditor {...defaultProps} />);
    expect(screen.getByText(/no links added yet/i)).toBeInTheDocument();
    expect(onAddMock).not.toHaveBeenCalled();
  });

  it('renders a list of links with correct titles and hrefs', () => {
    const links = [
      { title: 'First', url: 'https://first.example' },
      { title: 'Second', url: 'https://second.example' }
    ];
    render(<OverviewLinksEditor {...defaultProps} links={links} />);
    links.forEach(({ title, url }) => {
      const anchor = screen.getByRole('link', { name: title });
      expect(anchor).toHaveAttribute('href', url);
    });
  });

  it('calls onAdd when the Add Link button is clicked', () => {
    render(<OverviewLinksEditor {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /add link/i }));
    expect(onAddMock).toHaveBeenCalledTimes(1);
  });

  it('calls onRemove with the correct index when Remove is clicked', () => {
    const links = [{ title: 'Only', url: 'https://only.example' }];
    render(<OverviewLinksEditor {...defaultProps} links={links} />);
    fireEvent.click(screen.getByRole('button', { name: /remove link 0/i }));
    expect(onRemoveMock).toHaveBeenCalledWith(0);
  });

  it('calls onChange with updated link data when title or URL input changes', () => {
    const links = [{ title: 'Old', url: 'https://old.example' }];
    render(<OverviewLinksEditor {...defaultProps} links={links} />);
    const titleInput = screen.getByPlaceholderText('Title');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    expect(onChangeMock).toHaveBeenCalledWith(0, { title: 'New Title', url: 'https://old.example' });

    const urlInput = screen.getByPlaceholderText('URL');
    fireEvent.change(urlInput, { target: { value: 'https://new.example' } });
    expect(onChangeMock).toHaveBeenCalledWith(0, { title: 'Old', url: 'https://new.example' });
  });

  it('disables Add Link button when links.length >= maxLinks', () => {
    const links = new Array(defaultProps.maxLinks).fill({ title: 'X', url: 'https://x.example' });
    render(<OverviewLinksEditor {...defaultProps} links={links} />);
    const addButton = screen.getByRole('button', { name: /add link/i });
    expect(addButton).toBeDisabled();
  });

  it('handles undefined links prop gracefully without errors', () => {
    console.error = jest.fn();
    render(<OverviewLinksEditor {...defaultProps} links={undefined} />);
    expect(screen.getByText(/no links added yet/i)).toBeInTheDocument();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<OverviewLinksEditor {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});